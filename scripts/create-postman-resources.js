#!/usr/bin/env node

/**
 * Postman Resource Creation Script - Fully Automated
 * 
 * Usage:
 *   node create-postman-resources.js workspace "name"
 *   node create-postman-resources.js collection "name" "workspaceId"
 *   node create-postman-resources.js validate-user "email"
 * 
 * Workspace Setup Options:
 *   1. Create new workspace: Run 'workspace' command (auto-stores ID)
 *   2. Use existing workspace: Set POSTMAN_WORKSPACE_ID variable manually
 * 
 * Naming conventions:
 *   Workspace: "[team] repo-name"
 *   Master: "[team] repo-name #main"
 *   Feature: "[team] repo-name #feature-name"
 *   Bugfix: "[team] repo-name #issue-123"
 */

const https = require('https');
const { URL } = require('url');

class PostmanClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.getpostman.com';
    }

    async request(method, path, body = null) {
        const url = new URL(path, this.baseUrl);
        
        const options = {
            method: method,
            headers: {
                'X-API-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = {
                            status: res.statusCode,
                            data: JSON.parse(data)
                        };
                        
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(response);
                        } else {
                            reject(new Error(`API Error: ${res.statusCode} - ${data}`));
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            
            req.on('error', reject);
            
            if (body) {
                req.write(JSON.stringify(body));
            }
            
            req.end();
        });
    }

    async createWorkspace(name) {
        const body = {
            workspace: {
                name,
                type: 'team',
                description: `Workspace for ${name}`
            }
        };
        
        try {
            const response = await this.request('POST', '/workspaces', body);
            console.log('Workspace created successfully');
            
            // Always create a master collection in the new workspace
            const workspace = response.data.workspace;
            const masterName = `${name} #main`;
            await this.createCollection(masterName, workspace.id, `Master collection for ${name}`);
            
            return workspace;
        } catch (error) {
            console.error('Failed to create workspace:', error.message);
            throw error;
        }
    }

    async createCollection(name, workspaceId, description = '') {
        const body = {
            collection: {
                info: {
                    name,
                    description: description || `Collection: ${name}`,
                    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
                },
                item: []
            }
        };

        const path = `/collections?workspace=${workspaceId}`;

        try {
            const response = await this.request('POST', path, body);
            console.log('Collection created successfully');
            return response.data.collection;
        } catch (error) {
            console.error('Failed to create collection:', error.message);
            throw error;
        }
    }

    async getWorkspaceCollections(workspaceId) {
        try {
            const response = await this.request('GET', `/workspaces/${workspaceId}`);
            return response.data.workspace.collections || [];
        } catch (error) {
            console.error('Failed to get workspace collections:', error.message);
            return [];
        }
    }

    async findMasterCollection(workspaceId, baseName) {
        const collections = await this.getWorkspaceCollections(workspaceId);
        
        if (collections.length === 0) {
            return null;
        }

        // Look for the #main collection
        const masterName = `${baseName} #main`;
        const masterCollection = collections.find(col => 
            col.name === masterName || col.name.endsWith('#main')
        );

        return masterCollection;
    }

    async forkCollection(sourceCollectionId, workspaceId, forkLabel) {
        const body = {
            label: forkLabel
        };

        try {
            const response = await this.request(
                'POST', 
                `/collections/fork/${sourceCollectionId}?workspace=${workspaceId}`, 
                body
            );
            console.log('Collection forked successfully');
            return response.data.collection;
        } catch (error) {
            console.error('Failed to fork collection:', error.message);
            throw error;
        }
    }

    /**
     * Intelligently create or fork a collection based on its name
     */
    async smartCreateCollection(name, workspaceId) {
        // Parse the collection name to understand intent
        // Format: "[team] repo-name #branch" or "[team] repo-name-feature/branch"
        
        // Check if this is a branch collection (not #main)
        const isMain = name.includes('#main');
        const isBranch = name.includes('#') && !isMain;
        
        // For legacy format support (repo-feature/branch), convert to new format
        let finalName = name;
        if (name.includes('-feature/') || name.includes('-bugfix/') || name.includes('-hotfix/')) {
            // Convert "repo-feature/branch" to "repo #feature-branch"
            finalName = name
                .replace('-feature/', ' #feature-')
                .replace('-bugfix/', ' #bugfix-')
                .replace('-hotfix/', ' #hotfix-');
        }
        
        if (isMain || !finalName.includes('#')) {
            // This is a master collection or standalone collection
            return await this.createCollection(finalName, workspaceId);
        }
        
        // This is a branch, we need to fork
        // Extract base name (everything before #)
        const baseName = finalName.split('#')[0].trim();
        const branchPart = finalName.split('#')[1].trim();
        
        // Find the master collection to fork from
        const masterCollection = await this.findMasterCollection(workspaceId, baseName);
        
        if (masterCollection) {
            console.log(`Found master collection: ${masterCollection.name} (${masterCollection.id})`);
            const fork = await this.forkCollection(
                masterCollection.id,
                workspaceId,
                finalName
            );
            return fork;
        } else {
            console.log('No master collection found, creating new collection');
            return await this.createCollection(finalName, workspaceId);
        }
    }

    async getTeamUsers() {
        try {
            const response = await this.request('GET', '/users');
            console.log(`Retrieved ${response.data.data.length} team users`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to get team users:', error.message);
            throw error;
        }
    }

    async isUserInTeam(email) {
        if (!email) {
            console.log('No email provided for validation');
            return false;
        }

        try {
            const teamUsers = await this.getTeamUsers();
            const userExists = teamUsers.some(user =>
                user.email && user.email.toLowerCase() === email.toLowerCase()
            );

            if (userExists) {
                console.log(`User ${email} found in Postman team`);
            } else {
                console.log(`User ${email} not found in Postman team`);
            }

            return userExists;
        } catch (error) {
            console.error('Error validating user:', error.message);
            // Conservative approach: deny access on validation errors
            return false;
        }
    }
}

async function main() {
    const [,, resourceType, ...args] = process.argv;
    
    const apiKey = process.env.POSTMAN_API_KEY;
    if (!apiKey) {
        console.error('Error: POSTMAN_API_KEY environment variable is required');
        process.exit(1);
    }
    
    const client = new PostmanClient(apiKey);
    
    try {
        switch (resourceType) {
            case 'workspace': {
                const [name] = args;
                if (!name) {
                    console.error('Error: Workspace name is required');
                    process.exit(1);
                }
                
                const workspace = await client.createWorkspace(name);
                console.log('Workspace ID:', workspace.id);
                
                // Output for GitHub Actions
                if (process.env.GITHUB_OUTPUT) {
                    const fs = require('fs');
                    fs.appendFileSync(process.env.GITHUB_OUTPUT, `workspace_id=${workspace.id}\n`);
                }
                break;
            }
            
            case 'collection': {
                const [name, workspaceId] = args;
                if (!name || !workspaceId) {
                    console.error('Error: Collection name and workspace ID are required');
                    process.exit(1);
                }
                
                const collection = await client.smartCreateCollection(name, workspaceId);
                console.log('Collection ID:', collection.id);
                console.log('Collection UID:', collection.uid);
                
                // Output for GitHub Actions
                if (process.env.GITHUB_OUTPUT) {
                    const fs = require('fs');
                    fs.appendFileSync(process.env.GITHUB_OUTPUT, `collection_id=${collection.id}\n`);
                    fs.appendFileSync(process.env.GITHUB_OUTPUT, `collection_uid=${collection.uid}\n`);
                    if (collection.fork) {
                        fs.appendFileSync(process.env.GITHUB_OUTPUT, `fork_source=${collection.fork.from}\n`);
                    }
                }
                break;
            }
            
            case 'validate-user': {
                const [email] = args;
                if (!email) {
                    console.error('Error: Email is required for user validation');
                    process.exit(1);
                }

                const isValid = await client.isUserInTeam(email);
                console.log('User validation result:', isValid ? 'AUTHORIZED' : 'NOT_AUTHORIZED');

                // Output for GitHub Actions
                if (process.env.GITHUB_OUTPUT) {
                    const fs = require('fs');
                    fs.appendFileSync(process.env.GITHUB_OUTPUT, `user_authorized=${isValid}\n`);
                }

                // Exit with appropriate code for shell scripts
                process.exit(isValid ? 0 : 1);
            }

            default:
                console.error('Usage:');
                console.error('  node create-postman-resources.js workspace <name>');
                console.error('  node create-postman-resources.js collection <name> <workspaceId>');
                console.error('  node create-postman-resources.js validate-user <email>');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { PostmanClient };