# Postman Scaffolding - GitHub to Postman Automation

## What This Does

Automates Postman workspace and collection management to mirror your GitHub repository structure. Any Git activity automatically creates the workspace if it doesn't exist. Create a feature branch, get a forked collection. Merge the PR, the fork disappears. Zero manual collection management.

Your API documentation and testing assets follow the same branching strategy as your code. Feature branches get isolated collections for testing without affecting production documentation. The structure stays organized automatically while you handle the actual collection content.

For teams just getting Postman Enterprise, this means you can scaffold your entire organization retroactively. Run the propagator once and watch it create organized workspaces for every repository, transforming an empty Postman instance into a structured environment that mirrors your existing codebase.

## How It Works

The integration operates on a simple principle: GitHub events trigger Postman API calls. The system auto-creates workspaces with master collections whenever they're needed. Create a feature branch, get a forked collection. Merge the PR, the fork disappears.

```
GitHub Event Flow → Postman Actions

Repository Setup:
git push origin main ──────────────→ [Auto-create workspace + master collection]
                                     │
                                     └── Store workspace/collection IDs

Feature Development:
git checkout -b feature/auth ─────────→ [Check workspace exists]
git push origin feature/auth          │
                                      ├── Create if missing ──→ [Fork master collection]
                                      └── Use existing ────────→ [Fork master collection]

PR Merge Cleanup:
PR merged ────────────────────────────→ [Delete forked collection]
```

The naming convention keeps everything organized: workspaces are `[org] repo-name`, master collections are `[org] repo-name #main`, and branch collections are `[org] repo-name #feature-description`. This makes it immediately obvious what you're looking at in Postman, even with dozens of repositories and hundreds of collections.

For security, it validates users against your Postman team membership. If someone's not on the team, they can still push code but won't trigger Postman resource creation. You can override this with a variable if you want to allow everyone (useful for open source or just-in-time licensing).

## Quick Start

### For Individual Repositories

Copy the standalone workflow and script to your repository:

```bash
cp .github/workflows/postman-sync-repo.yml <your-repo>/.github/workflows/
cp scripts/create-postman-resources.js <your-repo>/scripts/
```

Set your Postman API key:

```bash
gh secret set POSTMAN_API_KEY --body "your-postman-api-key"
```

Push to main to create your workspace and master collection.

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

Perfect for teams just getting Postman Enterprise who want to scaffold out their entire instance retroactively. The propagator will scan your existing repositories and create organized workspaces automatically.

Two ways to deploy this across your organization:

### Automated Propagation (Recommended)

This approach automatically creates PRs to add the Postman workflow to all repositories in your organization. New repos get the workflow within 24 hours, existing repos get a one-time PR.

The retroactive setup is particularly powerful for new Enterprise customers - you can take an empty Postman instance and have organized workspaces for your entire codebase within a few hours. Each repository becomes a workspace with proper naming conventions, and you get the full branching workflow immediately.

#### Setup

1. Fork or copy this repository to your organization
2. Copy the workflows to your org's `.github` repository:
   ```bash
   cp .github/workflows/postman-sync-org.yml your-org/.github/.github/workflows/
   cp .github/workflows/workflow-propagator.yml your-org/.github/.github/workflows/
   ```

3. Set organization secrets:
   ```bash
   # Required: Postman API key
   gh secret set POSTMAN_API_KEY --org your-org-name --body "your-postman-api-key"

   # Required: GitHub PAT with repo and workflow scope for creating PRs
   gh secret set ORG_PROPAGATOR_TOKEN --org your-org-name --body "<github-pat>"
   ```

4. Run the propagator manually to set up existing repos:
   ```bash
   gh workflow run workflow-propagator.yml --org your-org-name
   ```

The propagator runs daily at 2 AM UTC and:
- Scans all repositories in the organization
- Creates PRs for repos missing the Postman workflow
- Skips repos that already have the workflow or an open PR
- Provides a summary of actions taken

You can also run it manually with dry-run mode or target specific repositories. For immediate retroactive setup, run it manually after initial configuration to scaffold your entire organization at once.

### Manual Setup

If you prefer not to use automated propagation, add the workflow manually to each repository:

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

After the first workflow run, store the generated IDs:

```bash
# Get the IDs from workflow output
gh run view --log | grep -E "(workspace_id|master_collection_id)"

# Store as repository variables
gh variable set POSTMAN_WORKSPACE_ID --body "<workspace-id>"
gh variable set POSTMAN_MASTER_COLLECTION_ID --body "<collection-id>"
```

### Advanced Configuration: Automated Variable Storage

For fully automated variable storage (no manual steps), add repository dispatch support:

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

This eliminates the manual variable storage step by using repository dispatch to send IDs back to the calling repository. Requires an additional PAT with repo scope set as `ORG_DISPATCH_TOKEN`.

## How User Validation Works

The system checks if the GitHub user's email exists in your Postman team. It tries to get the email from GitHub Enterprise context first, then falls back to commit author email. If the user isn't found, the workflow continues but skips Postman resource creation.

This prevents random contributors from creating collections in your workspace while still allowing them to contribute code. If you're using just-in-time provisioning or want to allow everyone, set `POSTMAN_ALLOW_ALL_USERS=true`.

## Stored Variables

The system uses GitHub repository variables to maintain workspace context:

- `POSTMAN_WORKSPACE_ID` - The workspace UUID for this repository
- `POSTMAN_MASTER_COLLECTION_ID` - The master collection UUID for efficient forking

### Variable Storage

**With Automated Propagation**: After merging the PR and first push to main, check the workflow output for workspace/collection IDs and store them manually (one-time, 30-second task).

**With Repository Dispatch**: Variables are stored automatically when workspace is created (requires `ORG_DISPATCH_TOKEN` with repo scope).

## Troubleshooting

When users can't create resources, it's usually because they're not in the Postman team. Either add them to the team or set `POSTMAN_ALLOW_ALL_USERS=true`.

If collection creation fails with "no workspace ID", push to main first to trigger workspace creation. Or manually set the workspace ID if you want to use an existing one.

Fork cleanup failures during PR merge are harmless - the collection was probably already deleted manually.

For retroactive Enterprise setup, expect the initial propagation to create dozens or hundreds of PRs across your organization. Teams can merge these at their own pace - the Postman integration activates automatically after the first push to main following the merge.

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

## Architecture

### Components

**Workflow Propagator** (`workflow-propagator.yml`): Runs daily to scan your organization and create PRs for repositories missing the Postman workflow. Can be run manually with dry-run mode or targeted at specific repos.

**Organization Workflow** (`postman-sync-org.yml`): Centralized reusable workflow containing all Postman integration logic. Downloads scripts dynamically so individual repos don't need to maintain them.

**Repository Workflow** (`templates/postman-workflow.yml`): Minimal wrapper that calls the org workflow. This is what gets propagated to each repository.

**Resource Creation Script** (`scripts/create-postman-resources.js`): Handles Postman API interactions - workspace creation, collection forking, and cleanup. Intelligently forks from master collection when creating branch collections.

### How It Works

The system uses GitHub repository variables to maintain state. When a workspace is created, the IDs are stored as `POSTMAN_WORKSPACE_ID` and `POSTMAN_MASTER_COLLECTION_ID`. The master collection ID optimization reduces API calls from three (get workspace, search collections, fork) to one (direct fork with known ID).

Branch detection uses GitHub event context to determine actions - push to main ensures workspace exists, feature branch creation triggers collection forking, and PR merge triggers cleanup. User validation checks Postman team membership via email, with an override option for open source projects.

The propagator creates non-intrusive PRs that teams can review and merge when ready. Once merged, the Postman integration activates automatically on the next push to main.