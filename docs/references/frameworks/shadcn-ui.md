# shadcn/ui Reference for AppFactory

## Overview

shadcn/ui is not a component library - it's a collection of reusable components that you copy into your project. This gives you full ownership and customization ability.

## Installation

### Initialize

```bash
npx shadcn@latest init
```

Options:

- Style: Default / New York
- Base color: Zinc, Slate, Stone, Gray, Neutral
- CSS variables: Yes (recommended)

### Add Components

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Add multiple
npx shadcn@latest add button card dialog input
```

## Project Structure

```
components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
lib/
└── utils.ts          # cn() helper
```

## Core Components

### Button

```typescript
import { Button } from "@/components/ui/button";

// Variants
<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>
```

### Card

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Dialog

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description text.</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>;
```

### Form with React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## AI Elements

New components for AI/chat interfaces:

### Chat

```bash
npx shadcn@latest add chat
```

```typescript
import { Chat, ChatMessage, ChatInput } from "@/components/ui/chat";

<Chat>
  <ChatMessage role="user">Hello!</ChatMessage>
  <ChatMessage role="assistant">Hi! How can I help?</ChatMessage>
  <ChatInput onSubmit={handleSubmit} />
</Chat>;
```

### Thinking Indicator

```typescript
import { ThinkingIndicator } from "@/components/ui/thinking";

<ThinkingIndicator isThinking={isLoading} />;
```

## Theming

### CSS Variables

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Customizing Components

Since components are in your codebase, customize directly:

```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // Add your own variant
        brand: "bg-blue-600 text-white hover:bg-blue-700",
      },
    },
  }
);
```

## Utility: cn()

The `cn()` function merges Tailwind classes:

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:

```typescript
<div className={cn("bg-white p-4", isActive && "bg-blue-100", className)}>
  Content
</div>
```

## Common Patterns

### Loading State

```typescript
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Responsive Dialog/Drawer

```typescript
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

function ResponsiveModal({ children, open, onOpenChange }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
}
```

### Data Table

```bash
npx shadcn@latest add table
```

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>;
```

## Integration with Tailwind v4

shadcn/ui v2 works with Tailwind v4:

1. CSS variables map to `@theme` in Tailwind v4
2. No breaking changes to component usage
3. Container queries available automatically

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component List](https://ui.shadcn.com/docs/components)
- [Themes](https://ui.shadcn.com/themes)
- [Examples](https://ui.shadcn.com/examples)
