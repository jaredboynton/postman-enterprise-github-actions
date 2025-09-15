# Postman Scaffolding - VCS > Postman Automation

## What This Solves

This integration creates Postman workspaces and collections that mirror your GitHub repository structure automatically. When you create a repo, you get a workspace. When you create a branch, you get a forked collection. When you merge a PR, the fork gets cleaned up. No manual steps, no forgotten collections, no workspace sprawl.

The real value here is that your API documentation and testing assets now follow the same branching strategy as your code. Feature branches get isolated collections that can be tested without affecting production documentation. When the feature merges, so does the collection content (though that part you still handle manually - this just manages the structure).

Everything's nice, clean, and follows naming conventions.

## How It Works

The integration operates on a simple principle: GitHub events trigger Postman API calls. Push to main creates a workspace with a master collection. Create a feature branch, get a forked collection. Merge the PR, the fork disappears.

The naming convention keeps everything organized: workspaces are `[org] repo-name`, master collections are `[org] repo-name #main`, and branch collections are `[org] repo-name #feature-description`. This makes it immediately obvious what you're looking at in Postman, even with dozens of repositories and hundreds of collections.

For security, it validates users against your Postman team membership. If someone's not on the team, they can still push code but won't trigger Postman resource creation. You can override this with a variable if you want to allow everyone (useful for open source or just-in-time licensing).

## Installation

First, you need a Postman Team or Enterprise account and a Github Organization where you have admin access. The workflow files are in `.github`.

### Basic Setup

Copy the workflow and script to your repository:

```bash
# Copy files to your repo
cp -r .github/workflows/postman-sync-repo.yml <your-repo>/.github/workflows/
cp -r scripts/create-postman-resources.js <your-repo>/scripts/
```

Set up your Postman API key as a GitHub secret:

```bash
gh secret set POSTMAN_API_KEY --body "your-postman-api-key"
```

That's it for basic setup. The first push to main will create your workspace and master collection automatically.

### Optional Configuration

If you want all users to create resources regardless of Postman team membership:

```bash
gh variable set POSTMAN_ALLOW_ALL_USERS --body "true"
```

If you want to use an existing workspace instead of auto-creating one:

```bash
gh variable set POSTMAN_WORKSPACE_ID --body "existing-workspace-uuid"
gh variable set POSTMAN_MASTER_COLLECTION_ID --body "master-collection-uuid"
```

The master collection ID storage is an optimization I added - it eliminates API calls to search for the master collection every time you create a branch. The system works without it but runs faster with it.

## Usage Examples

### Standard Development Flow

Your normal development workflow just works:

```bash
# Initialize repository - creates workspace and master collection
git push origin main

# Start feature work - creates forked collection
git checkout -b feature/new-endpoint
git push origin feature/new-endpoint

# More branches - more forks
git checkout -b bugfix/auth-issue
git push origin bugfix/auth-issue

# Merge PR - fork gets deleted automatically
# The collection content merge is still manual in Postman
```

### Manual Operations

Sometimes you need to create collections outside the normal flow:

```bash
# Create a custom collection
gh workflow run postman-sync-repo.yml \
  -f action=create-collection \
  -f resource_name="Custom Integration Tests"

# Force workspace creation with custom name
gh workflow run postman-sync-repo.yml \
  -f action=create-workspace \
  -f resource_name="Special Project Workspace"
```

## Organization-Level Setup

Deploy Postman integration across your entire GitHub organization with centralized management. This approach eliminates the need to copy scripts to each repository.

### Prerequisites

1. Copy `postman-sync-org.yml` to your organization's `.github` repository:
   ```bash
   # In your org's .github repository
   cp postman-sync-org.yml .github/workflows/
   ```

2. Set your Postman API key at the organization level:
   ```bash
   gh secret set POSTMAN_API_KEY --org your-org-name --body "your-postman-api-key"
   ```

Now choose your setup approach:

### Option A: Simple Setup (Manual Variable Storage)

Best for organizations prioritizing simplicity and transparency. Requires a one-time manual step per repository.

#### Repository Configuration

Add this minimal workflow to any repository:

```yaml
# .github/workflows/postman.yml
name: Postman Integration
on:
  push:
    branches: [main, master, 'feature/**', 'bugfix/**', 'hotfix/**']
  create:
  pull_request:
    types: [closed]

jobs:
  sync:
    uses: your-org/.github/.github/workflows/postman-sync-org.yml@main
    secrets: inherit
```

#### One-Time Setup

After the first push to main/master:

1. Check the workflow output for created IDs:
   ```bash
   gh run view --log | grep -E "(workspace_id|master_collection_id)"
   ```

2. Store them as repository variables:
   ```bash
   gh variable set POSTMAN_WORKSPACE_ID --body "<workspace-id>"
   gh variable set POSTMAN_MASTER_COLLECTION_ID --body "<collection-id>"
   ```

### Option B: Advanced Setup (Fully Automated)

Best for organizations managing 50+ repositories. Completely automates variable storage using repository dispatch.

#### Additional Organization Setup

Create a GitHub PAT with `repo` scope for automated variable storage:

```bash
gh secret set ORG_DISPATCH_TOKEN --org your-org-name --body "<github-pat-with-repo-scope>"
```

#### Repository Configuration

Add this expanded workflow to handle automated variable storage:

```yaml
# .github/workflows/postman.yml
name: Postman Integration
on:
  push:
    branches: [main, master, 'feature/**', 'bugfix/**', 'hotfix/**']
  create:
  pull_request:
    types: [closed]

  # Listen for variable storage from org workflow
  repository_dispatch:
    types: [postman-resources-created]

jobs:
  sync:
    if: github.event_name != 'repository_dispatch'
    uses: your-org/.github/.github/workflows/postman-sync-org.yml@main
    secrets: inherit

  # Automatically store variables when workspace is created
  store-variables:
    if: github.event_name == 'repository_dispatch'
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - name: Store Postman IDs
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          echo "Storing Postman workspace and collection IDs..."
          gh variable set POSTMAN_WORKSPACE_ID \
            --repo ${{ github.repository }} \
            --body "${{ github.event.client_payload.workspace_id }}"
          gh variable set POSTMAN_MASTER_COLLECTION_ID \
            --repo ${{ github.repository }} \
            --body "${{ github.event.client_payload.master_collection_id }}"
          echo "✓ Variables stored successfully"
```

With this setup, everything is automated - no manual steps required.

### Choosing Your Approach

| Aspect | Simple Setup | Advanced Setup |
|--------|-------------|----------------|
| Manual Steps | One-time per repo (30 seconds) | None |
| Repository Workflow | 12 lines | 35 lines |
| Additional Secrets | None | PAT with repo scope |
| Best For | < 50 repositories | 50+ repositories |
| Security Considerations | None | Repos accept dispatch events |

## How User Validation Works

The system checks if the GitHub user's email exists in your Postman team. It tries to get the email from GitHub Enterprise context first, then falls back to commit author email. If the user isn't found, the workflow continues but skips Postman resource creation.

This prevents random contributors from creating collections in your workspace while still allowing them to contribute code. If you're using just-in-time provisioning or want to allow everyone, set `POSTMAN_ALLOW_ALL_USERS=true`.

## Stored Variables

The system uses GitHub repository variables to maintain workspace context:

- `POSTMAN_WORKSPACE_ID` - The workspace UUID for this repository
- `POSTMAN_MASTER_COLLECTION_ID` - The master collection UUID for efficient forking

### How Variables Are Stored

**Repository-Level Setup**: Automatically stored after workspace creation (requires `gh` CLI access).

**Organization-Level Setup**:
- **Simple Setup**: Manually stored after first run (one-time, takes 30 seconds)
- **Advanced Setup**: Automatically stored via repository dispatch (requires ORG_DISPATCH_TOKEN)

## Troubleshooting

When users can't create resources, it's usually because they're not in the Postman team. Either add them to the team or set `POSTMAN_ALLOW_ALL_USERS=true`.

If collection creation fails with "no workspace ID", push to main first to trigger workspace creation. Or manually set the workspace ID if you want to use an existing one.

Fork cleanup failures during PR merge are harmless - the collection was probably already deleted manually.

To debug issues:

```bash
# Check stored variables
gh variable list

# View recent workflow runs
gh run list --workflow=postman-sync-repo.yml

# Test Postman API access
curl -X GET https://api.getpostman.com/users \
  -H "X-API-Key: $POSTMAN_API_KEY"
```

## Technical Details

The Node.js script handles all Postman API interactions. It creates workspaces with master collections, intelligently forks collections based on naming patterns, and manages the full lifecycle. The GitHub workflow determines what action to take based on the event type and branch name, then calls the appropriate script function.

The master collection ID optimization means branch creation goes from three API calls (get workspace, search collections, fork) to just one (fork with known ID). This matters when you have teams creating dozens of branches per day.

The problem with administering Postman at scale isn't the process - it's expecting humans to remember to do repetitive tasks. Automation solves this completely. Now you can have nice, clean, and organized Postman structure that mirror your existing development structures without even thinking about it.