# Supabase MCP Reference

## Overview

The Supabase MCP server connects AI assistants directly to your Supabase projects for database management, migrations, and type generation.

## Installation

```bash
npx -y @supabase/mcp-server
```

## Configuration

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "https://your-project.supabase.co",
      "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
    }
  }
}
```

## Available Tools

### Database Operations

| Tool                | Description                      |
| ------------------- | -------------------------------- |
| `list_tables`       | List all tables in the database  |
| `get_table_schema`  | Get schema for a specific table  |
| `create_table`      | Create a new table               |
| `alter_table`       | Modify table structure           |
| `run_query`         | Execute SQL query                |

### Migrations

| Tool                | Description                      |
| ------------------- | -------------------------------- |
| `list_migrations`   | List all migrations              |
| `create_migration`  | Create a new migration           |
| `run_migration`     | Execute a migration              |
| `rollback_migration`| Rollback a migration             |

### Type Generation

| Tool                | Description                      |
| ------------------- | -------------------------------- |
| `generate_types`    | Generate TypeScript types        |

## Usage Examples

### Create a Table

```
Create a users table with id (uuid), email (text unique), created_at (timestamp)
```

The MCP server will generate and execute:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Generate Types

```
Generate TypeScript types for my database
```

Outputs types compatible with `@supabase/supabase-js`:

```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
  };
}
```

## Security Best Practices

### Use Project Scoping

For multi-project setups, use project-specific environment variables:

```json
{
  "supabase-prod": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "https://prod-project.supabase.co",
      "SUPABASE_SERVICE_ROLE_KEY": "prod-key"
    }
  },
  "supabase-dev": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "https://dev-project.supabase.co",
      "SUPABASE_SERVICE_ROLE_KEY": "dev-key"
    }
  }
}
```

### Enable Read-Only Mode

For production databases, limit to read operations:

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server", "--read-only"]
  }
}
```

### Never Expose Service Role Key

- Never commit keys to version control
- Use environment variables
- Rotate keys regularly

## Integration with AppFactory

### dapp-factory

Supabase is the default database for dApps:

1. Create tables for your app's data model
2. Generate TypeScript types
3. Set up Row Level Security (RLS)
4. Configure authentication

### miniapp-pipeline

Use Supabase for mini app state:

1. User preferences
2. Leaderboards
3. Social features

## Troubleshooting

### "Connection refused"

Verify your Supabase URL is correct and the project is active.

### "Invalid API key"

Ensure you're using the **service role key** (not anon key) for full access.

### "Permission denied"

Check Row Level Security policies if using anon key.

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase MCP Guide](https://supabase.com/docs/guides/getting-started/mcp)
- [Supabase TypeScript](https://supabase.com/docs/reference/javascript)
