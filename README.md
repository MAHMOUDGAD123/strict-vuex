<p align="center">
  <img src="./logo.svg" width="300" />
</p>

# Strict Vuex Type System

A comprehensive TypeScript type system for Vuex that provides complete type safety for modules, state, getters, actions, mutations, and mappers - This package will allow you to use vuex as-is but with a very strong and strict types to help you use it in a safe way.

## Table of Contents

- [Strict Vuex Type System](#strict-vuex-type-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Package Installation](#package-installation)
    - [TypeScript Configuration](#typescript-configuration)
    - [Troubleshooting Installation Issues](#troubleshooting-installation-issues)
  - [Naming Conventions](#naming-conventions)
  - [Project Store Structure](#project-store-structure)
    - [Best Practices for Structure](#best-practices-for-structure)
    - [Module Hierarchy](#module-hierarchy)
    - [Module Communication Pattern](#module-communication-pattern)
    - [File Organization Patterns](#file-organization-patterns)
      - [Pattern 1: Separate Type Files (Recommended)](#pattern-1-separate-type-files-recommended)
      - [Pattern 2: Single File Module (Simple Modules)](#pattern-2-single-file-module-simple-modules)
  - [Quick Start](#quick-start)
    - [Understanding the \_Module Type Parameters](#understanding-the-_module-type-parameters)
    - [Setup Step By Step](#setup-step-by-step)
      - [Step 1: Define Your Module Types](#step-1-define-your-module-types)
      - [Step 2: Register Modules in Type Declaration (CRITICAL STEP)](#step-2-register-modules-in-type-declaration-critical-step)
      - [Step 3: Implement Your Modules](#step-3-implement-your-modules)
      - [Step 4: Create the Store](#step-4-create-the-store)
      - [Step 5: Install The Store Instance As A Plugin](#step-5-install-the-store-instance-as-a-plugin)
      - [Step 6: Verify Type System is Working](#step-6-verify-type-system-is-working)
    - [How the Type System Works](#how-the-type-system-works)
    - [Common Mistakes to Avoid](#common-mistakes-to-avoid)
  - [Usage](#usage)
    - [Direct Store Access](#direct-store-access)
    - [Using Mappers in Components](#using-mappers-in-components)
    - [Namespaced Helpers](#namespaced-helpers)
    - [Root Actions in Namespaced Modules](#root-actions-in-namespaced-modules)
    - [Dynamic Module Registration](#dynamic-module-registration)
  - [Advanced Features](#advanced-features)
    - [Module Modes](#module-modes)
      - [Isolated Mode (namespaced: true)](#isolated-mode-namespaced-true)
      - [Default Mode (namespaced: false)](#default-mode-namespaced-false)
    - [Logger Plugin](#logger-plugin)
      - [Basic Usage](#basic-usage)
      - [Advanced Configuration](#advanced-configuration)
      - [Type-Safe Filtering](#type-safe-filtering)
    - [Action Context](#action-context)
      - [Root Level Actions](#root-level-actions)
      - [Isolated Module Actions](#isolated-module-actions)
      - [Default Module Actions](#default-module-actions)
      - [Context Properties](#context-properties)
    - [Nested Module Access](#nested-module-access)
      - [State Access](#state-access)
      - [Getters Access (Isolated Modules)](#getters-access-isolated-modules)
      - [Actions and Mutations (Isolated Modules)](#actions-and-mutations-isolated-modules)
      - [Cross-Module Communication](#cross-module-communication)
      - [Type-Safe Module State Resolution](#type-safe-module-state-resolution)
      - [Accessing Nested Modules in Context](#accessing-nested-modules-in-context)
      - [Store Subscriptions](#store-subscriptions)
      - [Watch API](#watch-api)
  - [Type Definitions Reference](#type-definitions-reference)
    - [StoreActionRecord - interface](#storeactionrecord---interface)
    - [\_Module - interface](#_module---interface)
    - [ResolveModuleStateByName - type](#resolvemodulestatebyname---type)
  - [API Reference](#api-reference)
    - [Store Methods](#store-methods)
    - [Mapper Functions](#mapper-functions)
  - [Best Practices](#best-practices)
    - [Best Practices Examples](#best-practices-examples)
      - [1. Always Use Object Payloads For Actions and Mutations](#1-always-use-object-payloads-for-actions-and-mutations)
      - [2. Define Types Before Implementation](#2-define-types-before-implementation)
      - [3. Use Consistent Naming Conventions](#3-use-consistent-naming-conventions)
      - [4. Organize Module Structure](#4-organize-module-structure)
      - [5. Handle Root Actions Properly](#5-handle-root-actions-properly)
  - [⚡ Performance Tips](#-performance-tips)
    - [1. TypeScript Configuration (Recommended)](#1-typescript-configuration-recommended)
    - [2. Git Ignore](#2-git-ignore)
    - [3. Restart TypeScript Server](#3-restart-typescript-server)
  - [Migration Guide](#migration-guide)
  - [Troubleshooting](#troubleshooting)
  - [FAQ](#faq)

## Features

- ✅ **Full Type Safety**: Complete TypeScript support for all Vuex features with end-to-end type inference
- ✅ **Nested Modules**: Support for deeply nested module structures with proper type inference and state resolution
- ✅ **Namespaced Modules**: Full support for both namespaced (`isolated`) and non-namespaced (`default`) modules
- ✅ **Root Actions**: Proper typing for root-level actions in namespaced modules with `{ root: true }` flag
- ✅ **Typed Mappers**: Fully typed `mapState`, `mapGetters`, `mapActions`, `mapMutations` helpers with namespace support
- ✅ **Dynamic Module Registration**: Type-safe module registration/unregistration at runtime with path validation
- ✅ **Action Context**: Properly typed dispatch and commit within action contexts with module-aware types
- ✅ **Path Validation**: Type-safe module paths for `hasModule`, `registerModule`, and `unregisterModule`
- ✅ **Getters Resolution**: Full getter type resolution across module boundaries with proper namespace prefixing
- ✅ **Mutations Resolution**: Complete mutation typing with namespace awareness
- ✅ **Actions Resolution**: Action typing with root action support and proper return type inference
- ✅ **Logger Support**: Typed logger plugin with filtering, transformation options, and custom logger support
- ✅ **Subscription Hooks**: Typed mutation and action subscription methods with proper payload types
- ✅ **Watch API**: Type-safe store watching capabilities with getter and callback typing
- ✅ **Hot Module Replacement**: Full HMR support with type safety through `hotUpdate` method
- ✅ **Composition API Support**: Full `useStore` hook typing for Vue 3 Composition API
- ✅ **Store Options**: Fully typed store creation options including plugins, strict mode, and devtools
- ✅ **Namespaced Helpers**: `createNamespacedHelpers` with full type inference for bound mappers
- ✅ **Module Modes**: Support for `isolated` (namespaced) and `default` (non-namespaced) module modes
- ✅ **Module Tree Traversal**: Automatic type resolution for complex module hierarchies
- ✅ **Payload Validation**: Enforced object-style payloads for better type safety and consistency
- ✅ **Custom Store Properties**: Extensible store types through TypeScript module augmentation
- ✅ **Component Integration**: Automatic `$store` typing in Vue components through module augmentation
- ✅ **State Functions**: Support for both object and function-style state definitions
- ✅ **Module Relationship Tracking**: Parent-child module relationships with depth and hierarchy information

## Installation

### Package Installation

Install the package using your preferred package manager:

```bash
# Using npm
npm install strict-vuex -D

# Using yarn
yarn add strict-vuex -D

# Using pnpm 🤍
pnpm add strict-vuex -D
```

### TypeScript Configuration

**_for PNPM users - you have to add the path mapping for vuex_**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "vuex": ["./node_modules/vuex/types"] // Fix for PNPM hoisting issue
    }
  }
}
```

### Troubleshooting Installation Issues

**Module Resolution Issues**

If TypeScript can't find Vuex types:

1. Clear TypeScript cache:

```bash
rm -rf node_modules/.cache
rm -rf node_modules/.tmp
```

2. Restart TypeScript service in your IDE:

   - VSCode: `Cmd/Ctrl` + `Shift` + `P` → "TypeScript: Restart TS Server"

3. Rebuild node_modules:

```bash
rm -rf node_modules package-lock.json
pnpm install
```

**Type Declaration Conflicts**

If you see duplicate identifier errors:

1. Ensure you don't have multiple Vuex type declarations
2. Check that skipLibCheck is set to true in tsconfig:

```bash
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

**Version Compatibility**

Ensure you're using compatible versions:

| Vue Version | Vuex Version | TypeScript Version |
| ----------- | ------------ | ------------------ |
| Vue 3.x     | Vuex 4.x     | TypeScript 4.5+    |
| Vue 2.7     | Vuex 3.x     | TypeScript 4.5+    |
| Vue 2.6     | Vuex 3.x     | TypeScript 3.5+    |

**Post-Installation Checklist**

- [ ] Vuex 4 is installed in `package.json`
- [ ] TypeScript configuration includes Vuex types
- [ ] PNPM path mapping is added (if using PNPM)
- [ ] Store directory structure is created
- [ ] IDE extensions are installed and configured
- [ ] TypeScript service recognizes Vuex types
- [ ] Test store creation works without type errors

## Naming Conventions

| Element             | Convention             | Example                |
| ------------------- | ---------------------- | ---------------------- |
| Module Files        | camelCase              | moduleA/index.ts       |
| Type Files          | camelCase              | types.ts               |
| Module Types        | PascalCase             | ModuleA, ModuleAA      |
| State Interface     | PascalCase + State     | ModuleAState           |
| Getters Interface   | PascalCase + Getters   | ModuleAGetters         |
| Actions Interface   | PascalCase + Actions   | ModuleAActions         |
| Mutations Interface | PascalCase + Mutations | ModuleAMutations       |
| Action Names        | camelCase              | fetchData, updateUser  |
| Mutation Names      | SCREAMING_SNAKE_CASE   | SET_DATA, UPDATE_USER  |
| Getter Names        | camelCase              | isLoggedIn, totalCount |

## Project Store Structure

```text
src/
└── store/
    ├── index.ts                    # Root store configuration
    └── modules/
        ├── moduleA/
        │   ├── index.ts            # ModuleA definition
        │   ├── types.ts            # ModuleA type interfaces
        │   └── modules/
        │       └── moduleAA/
        │           ├── index.ts    # ModuleAA definition
        │           ├── types.ts    # ModuleAA type interfaces
        │           └── modules/
        │               └── moduleAAA/
        │                   ├── index.ts    # ModuleAAA definition
        │                   └── types.ts    # ModuleAAA type interfaces
        └── moduleB/
             ├── index.ts    # ModuleB definition
             ├── types.ts    # ModuleB type interfaces
             └── modules/
                 └── moduleBB/
                     ├── index.ts    # ModuleBB definition
                     ├── types.ts    # ModuleBB type interfaces
                     └── modules/
                         └── moduleBBB/
                             ├── index.ts    # ModuleBBB definition
                             └── types.ts    # ModuleBBB type interfaces
```

### Best Practices for Structure

1. Keep modules focused - Each module should handle a single feature/domain
2. Consistent nesting - Follow the same structure pattern throughout
3. Type-first approach - Define types before implementation
4. Separate concerns - Split large modules into sub-modules
5. Avoid circular dependencies - Use type-only imports when needed
6. Document module purpose - Add comments explaining module responsibilities

### Module Hierarchy

The module tree structure for this example:

- `root` → `moduleA` → `moduleAA` → `moduleAAA`
- `root` → `moduleB` → `moduleBB` → `moduleBBB`

### Module Communication Pattern

```text
      ┌────────────────┐
      │      Root      │
      ├────────────────┤
      │                │
      ▼                ▼
   moduleA          moduleB
      │                │
      ▼                ▼
  moduleAA         moduleBB
      │                │
      ▼                ▼
  moduleAAA        moduleBBB
```

### File Organization Patterns

#### Pattern 1: Separate Type Files (Recommended)

```text
moduleA/
├── types.ts # Type definitions
├── state.ts # State definition
├── getters.ts # Getters
├── actions.ts # Actions
├── mutations.ts # Mutations
└── index.ts # Module assembly
```

#### Pattern 2: Single File Module (Simple Modules)

```text
store/
├── features/
│ ├── authentication/
│ ├── shopping-cart/
│ └── user-profile/
└── shared/
├── types.ts
└── utils.ts
```

## Quick Start

### Understanding the \_Module Type Parameters

The `_Module` type is the core of the type system. It accepts 7 parameters that define every aspect of your module:

```ts
interface _Module<
  ModuleName extends ModuleNames,           // 1. Module identifier
  Mode extends ModuleMode,                  // 2. 'isolated' or 'default'
  State extends StoreStateGeneric,          // 3. State type
  Getters extends StoreGettersGeneric,      // 4. Getters type
  Actions extends StoreActionsGeneric,      // 5. Actions type
  Mutations extends StoreMutationsGeneric,  // 6. Mutations type
  Modules = undefined                       // 7. Child modules (optional)
>
```

**Parameter 1: ModuleName**

The module's unique identifier. Must match the key used when registering the module.

```ts
type MyModule = _Module<
  'myModule', // Must be a string literal, not a variable
  ...
>;

// code
const myModuleInstance: MyModule = { ... }

// When registering:
const parentModule: ParentModule = {
  modules: {
    myModule: myModuleInstance // Key must match 'myModule'
  }
}
```

**Parameter 2: Mode**

Determines if the module is namespaced or not:

- `'isolated'` → `{ namespaced: true }` (creates namespace)
- `'default'` → `{ namespaced: false }` (no namespace)

```ts
// Isolated module - creates namespace 'userModule/'
type UserModule = _Module<'userModule', 'isolated', ...>;

// code
const userModule: UserModule = {
  namespaced: true,
  ...
}

// Default module - no namespace, merges with parent
type HelperModule = _Module<'helperModule', 'default', ...>;

// code
const helperModule: HelperModule = {
  namespaced: false,
  ...
}
```

**Parameter 3: State**

Define your state structure as an object type:

```ts
// [1] Simple state
type SimpleModule = _Module<
  'simpleModule',
  'isolated',
  { count: number }, // State with single property
  ...
>;

// code
const simpleModule: SimpleModule = {
  namespaced: true,
  state: { count: 5 },
  ...
}

// [2] Complex state
interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  filters: {
    role: string;
    status: 'active' | 'inactive';
  };
}

type UserModule = _Module<
  'userModule',
  'isolated',
  UserState, // Use interface for complex state
  ...
>;

// code
const userModule: UserModule = {
  namespaced: true,
  state: {
    currentUser: { ... };
    users: [...];
    loading: true;
    filters: {
      role: 'admin';
      status: 'active';
    };
  },
  ...
}
```

**Parameter 4: Getters**

Define getter return types as key-value pairs:

```ts
// Simple getters
type Module1 = _Module<
  'module1',
  'isolated',
  { count: number },
  {
    doubleCount: number;        // Simple return type
    isPositive: boolean;        // Boolean return
    formattedCount: (prefix: string) => string;     // Parameterized getter
  },
  ...
>;

// code
const module1: Module1 = {
  namespace: true,
  { count: 7 },
  {
    doubleCount(state) {
      return state.count * 2;
    },
    isPositive(state) {
      return state.count > 0;
    },
    formattedCount: (state) => (prefix: string) => `${prefix}${state.count}`;
  },
  ...
}
```

**Parameter 5: Actions**

Use `StoreActionRecord<Payload, Return, RootLevel>` to define actions:

```ts
interface StoreActionRecord<
  Payload,
  Return,
  RootLevel extends boolean = false
> {
  payload: Payload; // the action payload type
  return: Return; // the action return type
  root: RootLevel; // if true the action will be a root level action
}
```

```ts
type MyModule = _Module<
  'myModule',
  'isolated',
  State,
  Getters,
  {
    // Simple action - no payload - no return
    fetchData: StoreActionRecord<null, void>;

    // Action with payload
    updateUser: StoreActionRecord<
      { id: string; data: Partial<User> },  // Payload type
      User                                  // Return type
    >;

    // Root-level action (accessible globally)
    globalNotify: StoreActionRecord<
      { message: string },
      void,
      true  // Root level flag
    >;
  },
  ...
>;

// code
const myModule: MyModule = {
  namespaced: true,
  { ... }, // State
  { ... }, // Getters
  {
    fetchData({ dipatch }) {
      // Calling the globalNotify action with root level flag
      dipatch('globalNotify', { message: 'msg' }, { root: true }); // ✅
      // Calling it like this won't work
      dipatch('globalNotify', { message: 'msg' }); // ❌
      // You can use this which pointing to the store instance
      this.state // root level state
    },

    updateUser(ctx, payload) {
      return { ... }; // User
    }

    // Must define it like this or you will git a TypeScript error
    globalNotify: {
      root: true,
      handler: (ctx, payload) => {}
    }
  }
}
```

**Parameter 6: Mutations**

Mutations are simple key-value pairs with payload types:

```ts
type MyModule = _Module<
  'myModule',
  'isolated',
  State,
  Getters,
  Actions,
  {
    // Use SCREAMING_SNAKE_CASE for mutation names
    SET_LOADING: { loading: boolean };
    UPDATE_USER: { user: User };
    ADD_ITEM: { item: Item };
    DELETE_ITEM: { id: string };
    RESET_STATE: null;  // No payload
  },
  ...
>;

// code
const myModule: MyModule = {
  namespaced: true,
  { ... },
  { ... },
  { ... },
  {
    SET_LOADING(state, payload) {
      console.log(payload.loading);
    }
    ...
  }
}
```

**Parameter 7: Modules (Child Modules)**

Define nested modules or use `undefined` for leaf modules:

```ts
// Leaf module (no children)
type LeafModule = _Module<
  "leaf",
  "isolated",
  State,
  Getters,
  Actions,
  Mutations,
  undefined // No child modules
>;

// Parent module with children
type ParentModule = _Module<
  "parent",
  "isolated",
  State,
  Getters,
  Actions,
  Mutations,
  {
    childA: ChildModuleA; // Child module type
    childB: ChildModuleB; // Another child
    optionalChild?: OptionalModule; // Optional child module (used with module registed with registerModule() API at runtime)
  }
>;
```

**Empty Parameter**

If any parameter of the 7 parameters is empty and you won't assign any data to it
all you have to do is just assign a type `never` to in the type declaration.

```ts
type ModuleWithNoGetters = _Module<
  'moduleWithNoGetters',
  'isolated',
  State,
  never, // Empty getters
  Actions,
  Mutations,
  Modules
>;

const moduleWithNoGetters: ModuleWithNoGetters = {
  namespaced: true,
  state: { ... },
  // no Getters
  Mutations: { ... },
  actions: { ... },
  modules: { ... },
}
```

---

### Setup Step By Step

**_→ You need to make the type system see your modules tree types 👀_**

The key to making the Vuex type system work is proper module registration in the type declarations. Follow these steps to set up your typed store:

#### Step 1: Define Your Module Types

Start from the deepest modules and work your way up to the root:

`root` → `moduleA` → `moduleAA` → `moduleAAA`

```ts
// src/store/modules/moduleA/modules/moduleAA/modules/moduleAAA/types.ts
import type { _Module, StoreActionRecord } from "strict-vuex";

export type ModuleAAA = _Module<
  "moduleAAA",
  "isolated",
  { valueAAA: string },
  { getterAAA: string },
  { actionAAA: StoreActionRecord<{ data: string }, void> },
  { SET_AAA: { value: string } },
  undefined // No child modules
>;
```

```ts
// src/store/modules/moduleA/modules/moduleAA/types.ts
import type { ModuleAAA } from "./modules/moduleAAA/types";

export type ModuleAA = _Module<
  "moduleAA",
  "default",
  { valueAA: number },
  { getterAA: number },
  { actionAA: StoreActionRecord<{ val: number }, string> },
  { SET_AA: { value: number } },
  { moduleAAA: ModuleAAA } // Include child module type
>;
```

```ts
// src/store/modules/moduleA/types.ts
import type { ModuleAA } from "./modules/moduleAA/types";

export type ModuleA = _Module<
  "moduleA",
  "isolated",
  { valueA: boolean },
  { getterA: string },
  { actionA: StoreActionRecord<{ id: string }, boolean> },
  { SET_A: { value: boolean } },
  { moduleAA: ModuleAA } // Include child module type
>;
```

#### Step 2: Register Modules in Type Declaration (CRITICAL STEP)

This is the most important step 🔥 - Register your modules at the `VuexStoreRootModules` interface in to actualy make the system see you types - This is the step when the intellisense magical effect will start:

**Important Note**: You have to do this step before you start write you actual modules code in [step 3](#step-3-implement-your-modules)

And you can use the next interfaces to define the root data if you want too:

`VuexStoreRootState`, `VuexStoreRootGetters`, `VuexStoreRootActions`, `VuexStoreRootMutations`

And you can do this by simply extending the `strict-vuex` module in the app and i choose to extend it in the `src/store/types.d.ts` file which contains the root level data:

```ts
// src/store/index.ts

const store = createStore({ ... });
```

```ts
// src/store/types.d.ts
import type { ModuleA } from '@/store/modules/moduleA/types';
import type { ModuleB } from '@/store/modules/moduleB/types';

declare module 'strict-vuex' {
  // Root level configurations
  interface VuexStoreRootState {
    rootValue: string;
  }

  interface VuexStoreRootGetters {
    rootGetter: string;
  }

  interface VuexStoreRootActions {
    rootAction: StoreActionRecord<{ data: string }, void>;
  }

  interface VuexStoreRootMutations {
    SET_ROOT: { value: string };
  }

  // ⚠️ CRITICAL: Register your root modules here (only root modules)
  // For example if we have the next module tree:
  // root -> moduleA -> moduleAA -> moduleAAA
  // root -> moduleB -> moduleBB -> moduleBBB
  // So, you only need to define the root modules only like this
  // This is the step when the intellisense magical effect will start
  interface VuexStoreRootModules {
    moduleA: ModuleA;  // The key must match the module name in store
    moduleB: ModuleB;
  }
}
```

#### Step 3: Implement Your Modules

Starting from this step you will find that vuex system is fully typed and TypeScipt will force you to write the right code as your types defined before 😎🥲

```ts
// src/store/modules/moduleA/modules/moduleAA/modules/moduleAAA/index.ts
import type { ModuleAAA } from "./types";

const moduleAAA: ModuleAAA = {
  namespaced: true, // isolated = true
  state: {
    valueAAA: "AAA",
  },
  getters: {
    getterAAA: (state) => state.valueAAA,
  },
  actions: {
    actionAAA: async ({ commit }, payload) => {
      commit("SET_AAA", { value: payload.data });
    },
  },
  mutations: {
    SET_AAA(state, payload) {
      state.valueAAA = payload.value;
    },
  },
};

export default moduleAAA;

// And just do the same for other modules...
```

#### Step 4: Create the Store

```ts
// src/store/index.ts
import { createStore } from "vuex";
import moduleA from "./modules/moduleA";
import moduleB from "./modules/moduleB";

const store = createStore({
  state: {
    rootValue: "root",
  },
  getters: {
    rootGetter: (state) => state.rootValue,
  },
  actions: {
    rootAction: async ({ commit }, payload) => {
      commit("SET_ROOT", { value: payload.data });
    },
  },
  mutations: {
    SET_ROOT(state, payload) {
      state.rootValue = payload.value;
    },
  },
  modules: {
    moduleA, // Key must match VuexStoreRootModules interface
    moduleB,
  },
});

export default store;
```

#### Step 5: Install The Store Instance As A Plugin

```ts
// src/main.ts
import { createApp } from 'vue';
import vuexStore from `./store`;
const app = createApp({ ... });

app.use(vuexStore);
```

#### Step 6: Verify Type System is Working

The type system will now provide full IntelliSense - and you will find that it's so easy to use vuex

```ts
store.state.rootValue; // string
store.state.moduleA.valueA; // boolean
store.state.moduleA.moduleAA.valueAA; // number
store.state.moduleA.moduleAA.moduleAAA.valueAAA; // string

// Namespaced access for isolated modules
store.getters["moduleA/getterA"]; // string
store.getters["moduleA/getterAA"]; // number (default module, no namespace)
store.getters["moduleA/moduleAAA/getterAAA"]; // string

// Actions with proper payload types
store.dispatch("rootAction", { data: "test" });
store.dispatch("moduleA/actionA", { id: "123" });
store.dispatch("moduleA/moduleAAA/actionAAA", { data: "test" });
```

### How the Type System Works

- **Module Definition**: Each module is typed with `_Module` generic
- **Tree Building**: Child modules are included in parent's type definition
- **Registration**: Root modules MUST be registered in `VuexStoreRootModules`
- **Resolution**: The type system automatically resolves the entire tree
- **IntelliSense**: Full autocomplete and type checking throughout your app

### Common Mistakes to Avoid

- ❌ Forgetting to register modules in `VuexStoreRootModules`
- ❌ Module key mismatch between type and implementation
- ❌ Wrong module name in \_Module first parameter
- ❌ Missing child module types in parent definition

## Usage

### Direct Store Access

Direct store access provides fully typed access to state, getters, actions, and mutations throughout your application.

**OPTIONS API**

Short example for Options API usage

```html
<script lang="ts">
  import { defineComponent } from "vue";
  import { mapState, mapActions, mapMutations } from "vuex";

  export default defineComponent({
    computed: {
      moduleBVal: () => this.$store.state.moduleA.moduleB.value,
    },
    methods: {
      increment(value: number) {
        await this.$store.dispatch("moduleA/increment", { value });
      },
      resetCount() {
        this.$store.commit("moduleA/RESET_COUNT");
      },
    },
  });
</script>

<template>
  <div>
    <p>{{ $store.state.moduleA.count }}</p>
    <p>{{ moduleBVal }}</p>
    <p>{{ $store.getters['moduleA/doubleCount'] }}</p>
    <button @click="increment(10)">+</button>
    <button @click="resetCount">0</button>
  </div>
</template>
```

**COMPOSITION API**

Short example for Composition API usage (recommended):

```html
<script setup lang="ts">
  import { computed } from "vue";
  import { useStore } from "vuex";

  const store = useStore();
  const rootValue = computed(() => store.state.rootValue);
  const doActionA = (p: any) => store.dispatch("moduleA/actionA", p);
</script>

<template>
  <div>{{ rootValue }}</div>
</template>
```

**Type Safety in Both APIs**

```ts
// ✅ TypeScript provides full IntelliSense in both APIs

// Options API
this.$store.state.moduleA.? // Autocomplete shows: valueA, moduleAA
this.$store.dispatch('?') // Autocomplete shows available actions

// Composition API
store.state.moduleA.? // Autocomplete shows: valueA, moduleAA
store.dispatch('?') // Autocomplete shows available actions

// ❌ TypeScript catches errors at compile time

// Options API errors
this.$store.state.moduleA.wrongProperty; // Error: Property doesn't exist
this.$store.dispatch('wrongAction', {}); // Error: Action doesn't exist

// Composition API errors
store.state.moduleA.wrongProperty; // Error: Property doesn't exist
store.dispatch('wrongAction', {}); // Error: Action doesn't exist
```

---

### Using Mappers in Components

Mappers provide a clean way to bind store state, getters, actions, and mutations to component properties and methods.

**OPTIONS API**

This concise Options API example demonstrates common mapper usages:

```html
<script lang="ts">
  import { defineComponent } from "vue";
  import { mapState, mapActions, mapMutations } from "vuex";

  export default defineComponent({
    computed: {
      ...mapState(["rootValue"]),
      ...mapState("moduleA", { aValue: "valueA" }),
    },
    methods: {
      ...mapActions(["rootAction"]),
      ...mapActions("moduleA", ["actionA"]),
      ...mapMutations(["SET_ROOT", "moduleA/SET_A"]),
    },
  });
</script>

<template>
  <div>
    <p>{{ rootValue }}</p>
    <p>{{ aValue }}</p>
    <button @click="rootAction({ data: 'ok' })">Action</button>
  </div>
</template>
```

**COMPOSITION API**

No need to use mappers in Composition API

```html
<script setup lang="ts">
  import { computed } from "vue";
  import { useStore } from "vuex";

  const store = useStore();
  const rootValue = computed(() => store.state.rootValue);
  const doActionA = (p: any) => store.dispatch("moduleA/actionA", p);
</script>

<template>
  <div>{{ rootValue }}</div>
</template>
```

---

### Namespaced Helpers

Create typed helper functions for a specific namespaced module using `createNamespacedHelpers`. This is useful when you need to access the same module frequently in a component.

**Basic Usage**

```ts
import { createNamespacedHelpers } from "vuex";

// Create helpers for a specific namespace
const { mapState, mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("moduleA");

export default {
  computed: {
    // All mappers are scoped to 'moduleA'
    ...mapState(["a"]), // maps to moduleA state
    ...mapGetters(["getterA"]), // maps to moduleA getters
  },
  methods: {
    ...mapActions(["actionA"]), // maps to moduleA actions
    ...mapMutations(["mutationA"]), // maps to moduleA mutations
  },
};
```

**With Nested Modules**

```ts
// For deeply nested modules, use the full path
const { mapState, mapActions } = createNamespacedHelpers("moduleA/moduleAA");

export default {
  computed: {
    ...mapState(["aa"]), // moduleA/moduleAA state
  },
  methods: {
    ...mapActions(["actionAA"]), // moduleA/moduleAA actions
  },
};
```

**Array and Object Syntax**

```ts
const { mapState, mapActions } = createNamespacedHelpers("moduleA");

export default {
  computed: {
    // Array syntax - uses same name
    ...mapState(["a"]),

    // Object syntax - rename properties
    ...mapState({
      moduleAValue: "a",
      customName: (state) => state.a.toUpperCase(),
    }),
  },
  methods: {
    // Array syntax
    ...mapActions(["actionA"]),

    // Object syntax - rename or use custom functions
    ...mapActions({
      doActionA: "actionA",
      customAction: (dispatch, payload) => {
        return dispatch("actionA", payload);
      },
    }),
  },
};
```

**Benefits**

- **Less repetition**: No need to prefix every mapper with the namespace
- **Full type safety**: All mappers are typed to the specific module
- **Cleaner code**: Easier to read when working with a single module extensively

---

### Root Actions in Namespaced Modules

Root actions allow namespaced modules to expose actions globally, making them accessible without the namespace prefix.

**Defining Root Actions**

```ts
// src/store/modules/moduleA/modules/moduleAA/modules/moduleAAA/types.ts
import type { _Module, StoreActionRecord } from "strict-vuex";

export type ModuleAAA = _Module<
  "moduleAAA",
  "isolated",
  { valueAAA: string },
  { getterAAA: string },
  {
    // Local action - requires namespace
    localActionAAA: StoreActionRecord<{ data: string }, void>;

    // Root action - accessible globally
    globalActionAAA: StoreActionRecord<{ message: string }, boolean, true>; // true = root

    // Another root action
    notifyAllModules: StoreActionRecord<
      { alert: string; level: "info" | "error" },
      void,
      true
    >;
  },
  {
    SET_AAA: { value: string };
    NOTIFY: { message: string };
  },
  undefined
>;
```

**Implementing Root Actions**

```ts
// src/store/modules/moduleA/modules/moduleAA/modules/moduleAAA/index.ts
import type { ModuleAAA } from "./types";

const moduleAAA: ModuleAAA = {
  namespaced: true,

  state: {
    valueAAA: "initial",
  },

  getters: {
    getterAAA: (state) => state.valueAAA,
  },

  actions: {
    // Local action - simple function
    localActionAAA: async ({ commit }, payload) => {
      commit("SET_AAA", { value: payload.data });
    },

    // Root action - MUST be an object with root: true
    globalActionAAA: {
      root: true, // Required for root actions
      handler: async (
        { commit, dispatch, rootState, rootGetters },
        payload
      ) => {
        // Can access root state and getters directly
        console.log("Root state:", rootState.rootValue);
        console.log("Root getter:", rootGetters.rootGetter);

        // Can dispatch other root actions without { root: true }
        await dispatch("rootAction", { data: "from globalActionAAA" });

        // Can commit root mutations without { root: true }
        commit("SET_ROOT", { value: "updated from moduleAAA" });

        // Can still commit local mutations
        commit(
          "moduleA/moduleAAA/SET_AAA",
          { value: payload.message },
          { root: true }
        );

        return true;
      },
    },

    // Another root action
    notifyAllModules: {
      root: true,
      handler: async ({ dispatch, commit }, payload) => {
        // Notify all modules
        await dispatch("moduleA/handleNotification", payload, { root: true });
        await dispatch("moduleB/handleNotification", payload, { root: true });

        // Update global notification state
        commit("SET_GLOBAL_NOTIFICATION", payload, { root: true });
      },
    },
  },

  mutations: {
    SET_AAA(state, payload) {
      state.valueAAA = payload.value;
    },
    NOTIFY(state, payload) {
      console.log("Notification:", payload.message);
    },
  },
};

export default moduleAAA;
```

**Accessing Root Actions**

```ts
// Options API
export default {
  methods: {
    async handleActions() {
      // Root action - no namespace needed
      const result = await this.$store.dispatch("globalActionAAA", {
        message: "Hello from anywhere",
      });

      // Also accessible with full path + root option
      await this.$store.dispatch(
        "moduleA/moduleAAA/globalActionAAA",
        { message: "Hello" },
        { root: true }
      );

      // Local action - requires namespace
      await this.$store.dispatch("moduleA/moduleAAA/localActionAAA", {
        data: "test",
      });

      // Another root action
      await this.$store.dispatch("notifyAllModules", {
        alert: "System update",
        level: "info",
      });
    },
  },
};

// Composition API
const store = useStore();

// Root action - no namespace
await store.dispatch("globalActionAAA", { message: "Hello" });

// Local action - with namespace
await store.dispatch("moduleA/moduleAAA/localActionAAA", { data: "test" });

// Root action from deeply nested module
await store.dispatch("notifyAllModules", {
  alert: "Update",
  level: "error",
});
```

**Root Actions with Mappers**

```ts
<script lang="ts">
import { mapActions } from 'vuex';

export default {
  methods: {
    // Map root actions directly (no namespace)
    ...mapActions([
      'globalActionAAA',  // Root action from moduleAAA
      'notifyAllModules', // Another root action
      'rootAction'        // Root level action
    ]),

    // Map from namespace (for root actions, need special handling)
    ...mapActions('moduleA/moduleAAA', [
      'localActionAAA',   // Local action
      'globalActionAAA'   // Root action (requires { root: true } when called)
    ]),

    async handleMappedActions() {
      // Root actions mapped globally
      await this.globalActionAAA({ message: 'test' });
      await this.notifyAllModules({ alert: 'info', level: 'info' });

      // Local action from namespace mapping
      await this.localActionAAA({ data: 'test' });

      // Root action from namespace mapping - needs { root: true }
      await this.globalActionAAA(
        { message: 'test' },
        { root: true } // Required when mapped from namespace
      );
    }
  }
};
</script>
```

**Root Actions in Action Context**

```ts
// In any module action
const someModule: Module = {
  actions: {
    someAction: async ({ dispatch }) => {
      // Dispatch root action from moduleAAA
      await dispatch("globalActionAAA", { message: "test" }, { root: true });

      // Or without root flag since it's a root action
      await dispatch("globalActionAAA", { message: "test" });

      // Dispatch local action from another module
      await dispatch(
        "moduleA/moduleAAA/localActionAAA",
        { data: "test" },
        { root: true }
      );
    },
  },
};
```

**Important Rules for Root Actions**

```ts
// ✅ CORRECT: Root action as object
globalAction: {
  root: true,
  handler: async (context, payload) => {
    // Implementation
  }
}

// ❌ WRONG: Root action as function
globalAction: async (context, payload) => {
  // This won't work as root action
}

// ✅ CORRECT: Type definition with root flag
globalAction: StoreActionRecord<PayloadType, ReturnType, true>

// ❌ WRONG: Missing root flag in type
globalAction: StoreActionRecord<PayloadType, ReturnType> // defaults to false
```

---

### Dynamic Module Registration

The type system provides full support for registering and unregistering modules at runtime with type-safe paths.

**Module Registration Basics**

```ts
// Register top-level modules (depth 0)
store.registerModule("moduleC", moduleCInstance);
store.registerModule(["moduleC"], moduleCInstance); // Array notation also works

// Register nested modules (depth 1+)
store.registerModule(["moduleA", "moduleAC"], moduleACInstance);
store.registerModule(["moduleB", "moduleBC"], moduleBCInstance);

// Register deeply nested modules
store.registerModule(["moduleA", "moduleAA", "moduleAAC"], moduleAACInstance);
store.registerModule(["moduleB", "moduleBB", "moduleBBC"], moduleBBCInstance);

// ❌ Wrong: Can't use string for nested modules
store.registerModule("moduleA/moduleAC", moduleACInstance); // Error
store.registerModule("moduleA.moduleAC", moduleACInstance); // Error
```

**Dynamic Module Definition**

```ts
// Define a dynamic module type
import type { _Module, StoreActionRecord } from "strict-vuex";

export type DynamicModuleC = _Module<
  "moduleC",
  "isolated",
  { valueC: string; dynamicData: any[] },
  { getterC: string; dataCount: number },
  {
    loadDynamicData: StoreActionRecord<{ source: string }, any[]>;
    clearData: StoreActionRecord<null, void>;
  },
  {
    SET_C: { value: string };
    SET_DYNAMIC_DATA: { data: any[] };
  },
  undefined // No children initially
>;

const createDynamicModule = (initialValue: string): DynamicModuleC => ({
  namespaced: true,
  state: {
    valueC: initialValue,
    dynamicData: [],
  },
  getters: {
    getterC: (state) => state.valueC,
    dataCount: (state) => state.dynamicData.length,
  },
  actions: {
    loadDynamicData: async ({ commit }, payload) => {
      const data = await fetchData(payload.source);
      commit("SET_DYNAMIC_DATA", { data });
      return data;
    },
    clearData: async ({ commit }) => {
      commit("SET_DYNAMIC_DATA", { data: [] });
    },
  },
  mutations: {
    SET_C(state, payload) {
      state.valueC = payload.value;
    },
    SET_DYNAMIC_DATA(state, payload) {
      state.dynamicData = payload.data;
    },
  },
});
```

**Registering Modules at Runtime**

```ts
// Options API
export default {
  methods: {
    async loadFeatureModule() {
      // Check if module exists
      if (!this.$store.hasModule("moduleC")) {
        // Create and register module
        const moduleC = createDynamicModule("initial");
        this.$store.registerModule("moduleC", moduleC);

        // Module is now accessible
        await this.$store.dispatch("moduleC/loadDynamicData", {
          source: "api",
        });
        const value = this.$store.state.moduleC.valueC; // typed
      }
    },

    async loadNestedModule() {
      // Check nested module
      if (!this.$store.hasModule(["moduleA", "moduleAC"])) {
        const moduleAC = createNestedModule();
        this.$store.registerModule(["moduleA", "moduleAC"], moduleAC);

        // Access nested dynamic module
        const state = this.$store.state.moduleA.moduleAC; // typed if defined
      }
    },

    unloadModule() {
      if (this.$store.hasModule("moduleC")) {
        // Save state if needed
        const state = this.$store.state.moduleC;
        localStorage.setItem("moduleC", JSON.stringify(state));

        // Unregister module
        this.$store.unregisterModule("moduleC");
      }
    },
  },
};

// Composition API
const store = useStore();

async function loadDynamicModule() {
  if (!store.hasModule("moduleC")) {
    const moduleC = createDynamicModule("init");
    store.registerModule("moduleC", moduleC);
  }
}

async function loadNestedDynamic() {
  // Register nested module in moduleB tree
  if (!store.hasModule(["moduleB", "moduleBC"])) {
    const moduleBC = await import("./modules/moduleBC");
    store.registerModule(["moduleB", "moduleBC"], moduleBC.default);
  }
}
```

**Module Registration Options**

```ts
interface ModuleOptions {
  preserveState?: boolean; // Preserve existing state
}

// Register with options
store.registerModule("moduleC", moduleCInstance, {
  preserveState: true, // Keep existing state if hot reloading
});

// For nested modules
store.registerModule(["moduleA", "moduleAC"], moduleACInstance, {
  preserveState: localStorage.getItem("moduleAC") !== null,
});
```

**Checking Module Existence**

```ts
// Check top-level modules
const hasModuleA = store.hasModule("moduleA"); // true
const hasModuleC = store.hasModule("moduleC"); // false (not registered yet)

// Check nested modules - MUST use array notation
const hasModuleAA = store.hasModule(["moduleA", "moduleAA"]); // true
const hasModuleAAA = store.hasModule(["moduleA", "moduleAA", "moduleAAA"]); // true

// Check dynamic modules
const hasModuleAC = store.hasModule(["moduleA", "moduleAC"]); // false initially

// ❌ Wrong: Can't use string path for nested modules
// store.hasModule('moduleA/moduleAA'); // Always returns false
// store.hasModule('moduleA.moduleAA'); // Always returns false

// Helper function for safe access
function safeModuleAccess<T>(
  store: Store,
  path: string | string[],
  callback: () => T,
  fallback: T
): T {
  if (store.hasModule(path)) {
    return callback();
  }
  return fallback;
}

// Usage
const value = safeModuleAccess(
  store,
  "moduleC",
  () => store.state.moduleC.valueC,
  "default value"
);
```

**Unregistering Modules**

```ts
// Unregister top-level module
store.unregisterModule("moduleC");

// Unregister nested module
store.unregisterModule(["moduleA", "moduleAC"]);
store.unregisterModule(["moduleB", "moduleBB", "moduleBBC"]);

// Clean up before unregistering
function cleanUnregister(path: string | string[]) {
  if (store.hasModule(path)) {
    // Dispatch cleanup action if exists
    const modulePath = Array.isArray(path) ? path.join("/") : path;
    try {
      store.dispatch(`${modulePath}/cleanup`, null);
    } catch (e) {
      // Cleanup action might not exist
    }

    // Unregister
    store.unregisterModule(path);
  }
}

// Unregister multiple modules
function unregisterFeature(feature: string) {
  const modulesToRemove = {
    analytics: [
      "analytics",
      ["analytics", "reports"],
      ["analytics", "tracking"],
    ],
    chat: [
      ["features", "chat"],
      ["features", "chat", "messages"],
    ],
  };

  const paths = modulesToRemove[feature] || [];
  paths.forEach((path) => cleanUnregister(path));
}
```

**Hot Module Replacement**

```ts
// Hot reload for dynamic modules
if (import.meta.hot) {
  // Preserve state during development
  import.meta.hot.accept(["./modules/moduleC"], () => {
    const newModuleC = require("./modules/moduleC").default;

    // Update or register module
    if (store.hasModule("moduleC")) {
      store.hotUpdate({
        modules: {
          moduleC: newModuleC,
        },
      });
    } else {
      store.registerModule("moduleC", newModuleC, { preserveState: true });
    }
  });
}
```

## Advanced Features

### Module Modes

Vuex modules support two modes that affect how state, getters, actions, and mutations are accessed.

#### Isolated Mode (namespaced: true)

Isolated modules create a separate namespace, requiring the full path to access their members.

```ts
type ModuleA = _Module
  'moduleA',
  'isolated',  // Creates namespace
  { a: string },
  { getterA: string },
  { actionA: StoreActionRecord<{ val: string }, string> },
  { mutationA: { val: string } }
>;

const moduleA: ModuleA = {
  namespaced: true,  // Must be true for 'isolated' mode
  state: { a: 'value' },
  getters: {
    getterA(state) {
      return state.a;
    }
  },
  actions: {
    actionA(ctx, payload) {
      ctx.commit('mutationA', { val: 'new value' });
      return payload?.val ?? 'A';
    }
  },
  mutations: {
    mutationA(state, payload) {
      state.a = payload?.val ?? 'default';
    }
  }
};
```

**Access Pattern:**

```ts
// In components
store.state.moduleA.a; // ✓
store.getters["moduleA/getterA"]; // ✓
store.dispatch("moduleA/actionA", { val: "x" }); // ✓
store.commit("moduleA/mutationA", { val: "x" }); // ✓
```

#### Default Mode (namespaced: false)

Default modules merge their members into the parent scope (usually root).

```ts
type ModuleB = _Module
  'moduleB',
  'default',  // No namespace
  { b: string },
  { getterB: string },
  { actionB: StoreActionRecord<{ val: string }, string> },
  { mutationB: { val: string } }
>;

const moduleB: ModuleB = {
  namespaced: false,  // Must be false for 'default' mode
  state: { b: 'value' },
  getters: {
    getterB(state, getters, rootState, rootGetters) {
      // Has access to all root getters
      return state.b + rootGetters.someRootGetter;
    }
  },
  actions: {
    actionB(ctx, payload) {
      // Can access root actions and mutations directly
      ctx.dispatch('someRootAction', null);
      ctx.commit('someRootMutation', null);
      return payload?.val ?? 'B';
    }
  },
  mutations: {
    mutationB(state, payload) {
      state.b = payload?.val ?? 'default';
    }
  }
};
```

**Access Pattern:**

```ts
// In components
store.state.moduleB.b; // ✓ State still nested
store.getters.getterB; // ✓ Getters at root level
store.dispatch("actionB", { val: "x" }); // ✓ Actions at root level
store.commit("mutationB", { val: "x" }); // ✓ Mutations at root level
```

**Key Differences:**

| Feature             | Isolated Mode                       | Default Mode                |
| ------------------- | ----------------------------------- | --------------------------- |
| State Access        | `store.state.moduleA.a`             | `store.state.moduleB.b`     |
| Getters Access      | `store.getters['moduleA/getterA']`  | `store.getters.getterB`     |
| Actions Access      | `store.dispatch('moduleA/actionA')` | `store.dispatch('actionB')` |
| Mutations Access    | `store.commit('moduleA/mutationA')` | `store.commit('mutationB')` |
| Root Access         | Limited                             | Full                        |
| Namespace Pollution | None                                | Yes                         |

**Recommendation:** Use `isolated` mode for better organization and type safety, especially in large applications.

---

### Logger Plugin

The `createLogger` plugin helps debug your Vuex store by logging mutations and actions with full type safety.

#### Basic Usage

```ts
import { createStore, createLogger } from "vuex";

export const store = createStore({
  state: () => ({ count: 0 }),
  mutations: {
    INCREMENT: (state) => state.count++,
  },
  plugins: [createLogger()],
});
```

#### Advanced Configuration

```ts
import { createLogger } from "vuex";

const loggerPlugin = createLogger({
  // Collapse log groups (default: true)
  collapsed: false,

  // Filter which mutations to log
  filter(mutation, stateBefore, stateAfter) {
    // Only log INCREMENT mutations
    return mutation.type === "INCREMENT";
  },

  // Transform state before logging
  transformer(state) {
    // Hide sensitive data
    return {
      ...state,
      password: "***",
    };
  },

  // Transform mutation before logging
  mutationTransformer(mutation) {
    return {
      type: mutation.type,
      payload: mutation.payload,
    };
  },

  // Log actions (default: true)
  logActions: true,

  // Filter which actions to log
  actionFilter(action, state) {
    // Exclude certain actions
    return action.type !== "fetchSensitiveData";
  },

  // Transform action before logging
  actionTransformer(action) {
    return {
      type: action.type,
      payload: action.payload,
    };
  },

  // Log mutations (default: true)
  logMutations: true,

  // Custom logger (default: console)
  logger: {
    log: (message, color, payload) => {
      console.log(`%c ${message}`, `color: ${color}`, payload);
    },
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
  },
});

export const store = createStore({
  // ... store options
  plugins: [loggerPlugin],
});
```

#### Type-Safe Filtering

```ts
const loggerPlugin = createLogger<
  StoreRootStateResolved,
  StoreRootGettersResolved
>({
  filter(mutation, stateBefore, stateAfter) {
    // Full intellisense for mutation types
    if (mutation.type === "UPDATE_NAME") {
      // mutation.payload is typed as { fname: string; lname: string }
      console.log("Name updated to:", mutation.payload.fname);
      return true;
    }
    return false;
  },

  actionFilter(action, state) {
    // Full intellisense for action types
    if (action.type === "updateAge") {
      // action.payload is typed as { value: number }
      return action.payload.value > 18;
    }
    return true;
  },
});
```

**Console Output Example:**

```
▼ mutation UPDATE_NAME @ 10:30:15
  ▶ prev state: { fname: 'John', lname: 'Doe', age: 25 }
  ▶ mutation: { type: 'UPDATE_NAME', payload: { fname: 'Jane', lname: 'Smith' } }
  ▶ next state: { fname: 'Jane', lname: 'Smith', age: 25 }
```

---

### Action Context

Action handlers receive a context object with full type safety based on the module's scope.

#### Root Level Actions

```ts
interface VuexStoreRootActions {
  updateUser: StoreActionRecord<{ id: string; name: string }, User>;
}

// In store definition
actions: {
  async updateUser(ctx, payload) {
    // ctx has access to everything at root level
    ctx.state.fname;                    // ✓ Root state
    ctx.getters.fullName;               // ✓ Root getters
    ctx.commit('UPDATE_NAME', { ... }); // ✓ Root mutations
    ctx.dispatch('updateAge', { ... }); // ✓ Root actions

    ctx.rootState.fname;                // ✓ Same as ctx.state
    ctx.rootGetters.fullName;           // ✓ Same as ctx.getters

    return { id: payload.id, name: payload.name };
  }
}
```

#### Isolated Module Actions

```ts
type ModuleA = _Module
  'moduleA',
  'isolated',
  { a: string },
  { getterA: string },
  { actionA: StoreActionRecord<{ val: string }, string> },
  { mutationA: { val: string } }
>;

const moduleA: ModuleA = {
  namespaced: true,
  actions: {
    actionA(ctx, payload) {
      // Local scope access (no prefix needed)
      ctx.state.a;                          // ✓ Module state
      ctx.getters.getterA;                  // ✓ Module getters
      ctx.commit('mutationA', { val: 'x' }); // ✓ Module mutations
      ctx.dispatch('actionA', { val: 'y' }); // ✓ Module actions

      // Root scope access
      ctx.rootState.fname;                  // ✓ Root state
      ctx.rootGetters.fullName;             // ✓ Root getters

      // Access root mutations/actions (requires { root: true })
      ctx.commit('UPDATE_NAME', { ... }, { root: true });
      ctx.dispatch('updateAge', { ... }, { root: true });

      return payload?.val ?? 'A';
    }
  }
};
```

#### Default Module Actions

```ts
type ModuleB = _Module
  'moduleB',
  'default',
  { b: string },
  { getterB: string },
  { actionB: StoreActionRecord<{ val: string }, string> },
  { mutationB: { val: string } }
>;

const moduleB: ModuleB = {
  namespaced: false,
  actions: {
    actionB(ctx, payload) {
      // Module state (nested)
      ctx.state.b;                          // ✓ Module state

      // Everything else is at root level
      ctx.getters.getterB;                  // ✓ Module + root getters merged
      ctx.getters.fullName;                 // ✓ Root getters accessible

      ctx.commit('mutationB', { val: 'x' }); // ✓ No prefix needed
      ctx.commit('UPDATE_NAME', { ... });   // ✓ Root mutations accessible

      ctx.dispatch('actionB', { val: 'y' }); // ✓ No prefix needed
      ctx.dispatch('updateAge', { ... });   // ✓ Root actions accessible

      return payload?.val ?? 'B';
    }
  }
};
```

#### Context Properties

| Property      | Type           | Description                                             |
| ------------- | -------------- | ------------------------------------------------------- |
| `state`       | Module State   | Current module's state (or root state for root actions) |
| `getters`     | Module Getters | Available getters based on scope                        |
| `rootState`   | Root State     | Always the complete root state tree                     |
| `rootGetters` | Root Getters   | Always all root getters                                 |
| `commit`      | Function       | Commit mutations (scoped based on module mode)          |
| `dispatch`    | Function       | Dispatch actions (scoped based on module mode)          |

---

### Nested Module Access

Access state, getters, mutations, and actions from nested modules with full type safety.

#### State Access

```ts
// Module hierarchy: root -> moduleA -> moduleAA -> moduleAAA

// Access nested module state
store.state.moduleA.a; // ✓ ModuleA state
store.state.moduleA.moduleAA.aa; // ✓ ModuleAA state
store.state.moduleA.moduleAA.moduleAAA.aaa; // ✓ ModuleAAA state
```

#### Getters Access (Isolated Modules)

```ts
// All modules are isolated (namespaced: true)
store.getters["moduleA/getterA"]; // ✓
store.getters["moduleA/moduleAA/getterAA"]; // ✓
store.getters["moduleA/moduleAA/moduleAAA/getterAAA"]; // ✓
```

#### Actions and Mutations (Isolated Modules)

```ts
// Dispatch nested actions
store.dispatch("moduleA/actionA", { val: "x" });
store.dispatch("moduleA/moduleAA/actionAA", { val: "y" });
store.dispatch("moduleA/moduleAA/moduleAAA/actionAAA", { val: "z" });

// Commit nested mutations
store.commit("moduleA/mutationA", { val: "x" });
store.commit("moduleA/moduleAA/mutationAA", { val: "y" });
store.commit("moduleA/moduleAA/moduleAAA/mutationAAA", { val: "z" });
```

#### Cross-Module Communication

```ts
// In moduleAAA action
actions: {
  actionAAA(ctx, payload) {
    // Access parent module (moduleAA)
    ctx.state.aa;                              // ✓ Parent state
    ctx.getters['moduleA/moduleAA/getterAA'];  // ✓ Parent getters
    ctx.commit('moduleA/moduleAA/mutationAA', { ... }, { root: true });

    // Access root
    ctx.rootState.fname;                       // ✓ Root state
    ctx.rootGetters.fullName;                  // ✓ Root getters
    ctx.commit('UPDATE_NAME', { ... }, { root: true });

    // Access sibling modules (if they exist)
    ctx.dispatch('moduleA/moduleAB/actionAB', { ... }, { root: true });

    return 'AAA';
  }
}
```

#### Type-Safe Module State Resolution

```ts
// Get complete state tree for a specific module by name
type ModuleAState = ResolveModuleStateByName<"moduleA">;
// Result: { a: string, moduleAA: { aa: string, moduleAAA: { aaa: string } } }

type ModuleAAState = ResolveModuleStateByName<"moduleAA">;
// Result: { aa: string, moduleAAA: { aaa: string } }

// Usage in components or utilities
function getModuleAState(store: _Store): ModuleAState {
  return store.state.moduleA;
}
```

#### Accessing Nested Modules in Context

```ts
// In moduleA action
actions: {
  actionA(ctx, payload) {
    // Access child module state
    ctx.state.moduleAA.aa;              // ✓ Child state
    ctx.state.moduleAA.moduleAAA.aaa;   // ✓ Grandchild state

    // Dispatch to child modules
    ctx.dispatch('moduleAA/actionAA', { val: 'x' });
    ctx.dispatch('moduleAA/moduleAAA/actionAAA', { val: 'y' });

    // Commit to child modules
    ctx.commit('moduleAA/mutationAA', { val: 'x' });

    return 'A';
  }
}
```

#### Store Subscriptions

```ts
// Subscribe to mutations
const unsubscribeMutation = store.subscribe((mutation, state) => {
  // Fully typed mutation payload
  console.log("Mutation:", mutation.type);
  console.log("Payload:", mutation.payload);
  console.log("New State:", state);

  // Type narrowing
  if (mutation.type === "SET_USER") {
    console.log("User set to:", mutation.payload.username);
  }
});

// Subscribe to actions
const unsubscribeAction = store.subscribeAction({
  before: (action, state) => {
    console.log("Before action:", action.type);
    console.log("Payload:", action.payload);
  },
  after: (action, state) => {
    console.log("After action:", action.type);
  },
  error: (action, state, error) => {
    console.error("Action error:", action.type, error);
  },
});

// Simple action subscription (after only)
const unsubscribe = store.subscribeAction((action, state) => {
  console.log("Action completed:", action.type);
});

// Cleanup
unsubscribeMutation();
unsubscribeAction();
```

#### Watch API

```ts
// Watch specific state changes
const unwatch = store.watch(
  (state, getters) => state.user, // Getter function
  (newValue, oldValue) => {
    // Callback
    console.log("User changed from", oldValue, "to", newValue);
  },
  {
    deep: true, // Deep watch objects
    immediate: true, // Call immediately with current value
  }
);

// Watch computed values
store.watch(
  (state, getters) => getters.userInfo,
  (newValue, oldValue) => {
    console.log("User info updated:", newValue);
  }
);

// Complex watched expressions
store.watch(
  (state) => state.moduleA.count + state.moduleB.value,
  (sum) => {
    console.log("Combined value:", sum);
  }
);

// Cleanup
unwatch();
```

## Type Definitions Reference

This section summarizes the key types and declaration points provided by the `strict-vuex` package so you know where to look when something doesn't type-check.

- `VuexStoreRootState` / `VuexStoreRootGetters` / `VuexStoreRootActions` / `VuexStoreRootMutations`:

  - Root-level shape placeholders — add your root-level types here when you need global state/getters/actions/mutations typed.

- `VuexStoreRootModules`:

  - The single most important interface to populate. Put only your _root_ module types here (e.g. `{ moduleA: ModuleA; moduleB: ModuleB }`). The file builds the entire tree from these root entries.

- `_Module<ModuleName, Mode, State, Getters, Actions, Mutations, Modules>`:

  - Use this generic to describe each module. `Mode` controls namespacing (`'isolated'` === `namespaced: true`, `'default'` === `namespaced: false`).

- `StoreActionRecord<Payload, Return, RootLevel>`:

  - Use to declare actions payload/return types and whether they are root-level (`RootLevel = true`).

- `ResolveModuleStateByName<ModuleName>`:

  - get a module's full resolved state including nested children.

---

**Some Examples:**

### StoreActionRecord - interface

```ts
interface StoreActionRecord<
  Payload,
  Return,
  RootLevel extends boolean = false
> {
  payload: Payload;
  return: Return;
  root: RootLevel;
}

// Usage
type MyAction = StoreActionRecord<
  { id: string; data: any }, // Payload type
  Promise<boolean>, // Return type
  false // Is root action
>;
```

### \_Module - interface

```ts
interface _Module<
  ModuleName extends ModuleNames,
  Mode extends ModuleMode, // 'default' | 'isolated'
  State extends StoreStateGeneric = {},
  Getters extends StoreGettersGeneric = {},
  Actions extends StoreActionsGeneric = {},
  Mutations extends StoreMutationsGeneric = {},
  Modules = undefined // Nested modules
>

// Full example
type CompleteModule = _Module<
  'complete',
  'isolated',
  {
    // State
    counter: number;
    data: string[];
    settings: {
      theme: 'light' | 'dark';
      language: string;
    };
  },
  {
    // Getters
    doubleCounter: number;
    dataCount: number;
    formattedData: string;
  },
  {
    // Actions
    increment: StoreActionRecord<{ amount: number }, void>;
    fetchData: StoreActionRecord<null, string[]>;
    updateSettings: StoreActionRecord<{ theme?: string; language?: string }, boolean>;
  },
  {
    // Mutations
    SET_COUNTER: { value: number };
    ADD_DATA: { item: string };
    UPDATE_SETTINGS: { theme?: string; language?: string };
  },
  {
    // Nested modules
    subModuleA: SubModuleA;
    subModuleB: SubModuleB;
  }
>;
```

### ResolveModuleStateByName - type

```ts
type StateB = ResolveModuleStateByName<"moduleB">;
// Result: { b: string, moduleC: { c: string } }

// Usage in components or actions:
const moduleState: ResolveModuleStateByName<"moduleB"> = // ...
  console.log(moduleState.b); // string
console.log(moduleState.moduleC.c); // string
```

## API Reference

### Store Methods

| Method           | Description                 | Type Signature                                |
| ---------------- | --------------------------- | --------------------------------------------- |
| state            | Access store state          | readonly RootState                            |
| getters          | Access store getters        | readonly RootGetters                          |
| dispatch         | Dispatch actions            | (type, payload?, options?) => Promise<Return> |
| commit           | Commit mutations            | (type, payload?, options?) => void            |
| subscribe        | Subscribe to mutations      | (fn, options?) => () => void                  |
| subscribeAction  | Subscribe to actions        | (fn, options?) => () => void                  |
| watch            | Watch reactive changes      | (getter, cb, options?) => () => void          |
| registerModule   | Register module dynamically | (path, module, options?) => void              |
| unregisterModule | Unregister module           | (path) => void                                |
| hasModule        | Check module existence      | (path) => boolean                             |
| hotUpdate        | Hot update modules          | (options) => void                             |
| replaceState     | Replace entire state        | (state) => void                               |

### Mapper Functions

| Function                | Description                        | Usage                                |
| ----------------------- | ---------------------------------- | ------------------------------------ |
| mapState                | Map state to computed properties   | mapState(['prop'])                   |
| mapGetters              | Map getters to computed properties | mapGetters(['getter'])               |
| mapActions              | Map actions to methods             | mapActions(['action'])               |
| mapMutations            | Map mutations to methods           | mapMutations(['mutation'])           |
| createNamespacedHelpers | Create namespace-bound helpers     | createNamespacedHelpers('namespace') |

## Best Practices

- Register types first, runtime later: define your `_Module` types (deepest first), register them in `VuexStoreRootModules`, then implement module runtime objects. This prevents cyclic type/import issues and gives immediate IntelliSense.
- Use `namespaced: true` (`'isolated'`) for feature modules to avoid name collisions and make action/getter/mutation paths explicit.
- Prefer `import type { ... } from '...'` for type imports to avoid emitting circular runtime imports.
- Keep mutations as objects (payloads) rather than primitive payload types — the type system expects consistent payload shapes.
- For root actions declared with `StoreActionRecord<..., true>`, implement them as objects with `{ root: true, handler(...) { } }` — otherwise they will not be recognized as root actions by the types.
- Use `skipLibCheck: true` in `tsconfig` if you run into external type conflicts while integrating (temporary mitigation, not a fix).

### Best Practices Examples

#### 1. Always Use Object Payloads For Actions and Mutations

```ts
// ✅ Good - object payload
interface StoreRootActions {
  updateUser: StoreActionRecord<{ id: string; name: string }, void>;
}
interface StoreRootMutations {
  UPDATE_USER: { id: string; name: string };
}

// ❌ Bad - primitive payload
interface StoreRootActions {
  updateUser: StoreActionRecord<string, void>;
}
interface StoreRootMutations {
  UPDATE_USER: string;
}
```

#### 2. Define Types Before Implementation

```ts
// ✅ Good - define type first
export type UserModule = _Module<
  "user",
  "isolated",
  UserState,
  UserGetters,
  UserActions,
  UserMutations
>;

const userModule: UserModule = {
  // Implementation with full type safety
};

// ❌ Bad - no type definition
const userModule = {
  // No type safety
};
```

#### 3. Use Consistent Naming Conventions

```ts
// ✅ Good - consistent naming
interface StoreRootMutations {
  SET_USER: { user: User };
  UPDATE_USER: { updates: Partial<User> };
  DELETE_USER: { id: string };
}

interface StoreRootActions {
  fetchUser: StoreActionRecord<{ id: string }, User>;
  saveUser: StoreActionRecord<{ user: User }, boolean>;
  removeUser: StoreActionRecord<{ id: string }, void>;
}
```

#### 4. Organize Module Structure

```ts
// store/modules/user/types.ts
export interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
}

export interface UserGetters {
  isAuthenticated: boolean;
  currentUserName: string;
}

export interface UserActions {
  login: StoreActionRecord<LoginPayload, boolean>;
  logout: StoreActionRecord<null, void>;
}

export interface UserMutations {
  SET_USER: { user: User | null };
  SET_LOADING: { loading: boolean };
}

// store/modules/user/index.ts
export type UserModule = _Module<
  "user",
  "isolated",
  UserState,
  UserGetters,
  UserActions,
  UserMutations
>;

const userModule: UserModule = {
  // Implementation
};
```

#### 5. Handle Root Actions Properly

```ts
// ✅ Good - root action properly defined
export type GlobalModule = _Module<
  "global",
  "isolated",
  {},
  {},
  {
    globalNotification: StoreActionRecord<{ message: string }, void, true>; // true = root
  },
  {},
  undefined
>;

const globalModule: GlobalModule = {
  namespaced: true,
  actions: {
    globalNotification: {
      root: true, // Must be an object with root: true
      handler: async (ctx, payload) => {
        // Implementation
      },
    },
  },
};
```

## ⚡ Performance Tips

For optimal TypeScript performance in large codebases, apply these essential optimizations:

### 1. TypeScript Configuration (Recommended)

**Vue 3 Projects:** Add to your `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    // 🚀 Incremental compilation (50-70% faster rebuilds)
    "incremental": true,

    // Skip type checking of declaration files
    "skipLibCheck": true

    // Note: Vue 3 already includes "tsBuildInfoFile" by default
  }
}
```

**Vue 2 / Other Projects:** Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    // 🚀 Incremental compilation (50-70% faster rebuilds)
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",

    // Skip type checking of declaration files
    "skipLibCheck": true
  }
}
```

> **Note:** In Vue 3 projects, use `tsconfig.app.json` (for application code), NOT `tsconfig.node.json` (which is only for build tools).

### 2. Git Ignore

Vue 3 projects already ignore build info files. For other projects, add to `.gitignore`:

```gitignore
*.tsbuildinfo
```

### 3. Restart TypeScript Server

If experiencing slowdowns in VS Code:

- Press `Cmd/Ctrl + Shift + P`
- Run "TypeScript: Restart TS Server"

---

**That's it!** These 4 steps provide the most significant performance improvements.

## Migration Guide

If you're migrating an existing Vuex codebase to this typed system, follow these steps:

1. Install the `strict-vuex` package via `pnpm i strict-vuex -D`.
2. Create type files for leaf modules first: `src/store/modules/.../types.ts` using `_Module` generics.
3. Work upward: reference child module types in parent `_Module` `Modules` parameter.
4. Add root module entries in `VuexStoreRootModules` (only root modules) — this triggers the type resolution for the whole tree.
5. Update runtime module implementations to match types. Fix TypeScript errors iteratively — the type system gives explicit mismatches.
6. Replace any plain-action root-level functions with `{ root: true, handler(...) { } }` where you declared `StoreActionRecord<..., true>`.

## Troubleshooting

Common issues and fast fixes:

- "TypeScript doesn't see my `.d.ts` file":

  - Ensure the `.d.ts` path is included in `tsconfig.json` `include` or `typeRoots`. Restart the TS server.

- "No IntelliSense after adding `VuexStoreRootModules` entries":

  - Check that the module name string in `_Module<'name', ...>` matches the key used in `VuexStoreRootModules` and at runtime `modules: { name: ... }`.
  - Use `import type` in your declaration file to avoid circular runtime imports.

- "Root actions not available on `store.dispatch`":

  - Confirm action type uses `StoreActionRecord<..., ..., true>` and implementation uses object `{ root: true, handler(...) {} }` not a function.

- "Duplicate identifier" or third-party type conflicts:

  - Temporarily set `skipLibCheck: true` in `tsconfig`, search for duplicate `.d.ts` files for Vuex, and remove or consolidate them.

- "PNPM hoisting / module not found" errors:
  - Add `"vuex": ["./node_modules/vuex/types"]` to `compilerOptions.paths`.

If none of the above helps, run `tsc --noEmit` and inspect the first error — it usually points exactly to the mismatch (type name, payload shape, missing child module type).

## FAQ

- Q: Can I use this with Vue 2 / Vuex 3?

  - A: The type system targets Vuex 4 / Vue 3 primarily. Many patterns are compatible with Vuex 3 but types and some APIs differ — test in a branch and adapt signatures accordingly.

- Q: Can modules be registered at runtime and still be typed?

  - A: Yes — runtime registration works. Types for dynamic modules needs to be included in your declarations (you can declare optional child modules in parent `_Module` types or place dynamic module types somewhere referenced by `VuexStoreRootModules` or other helpers).

- Q: Why do I get `never` for some getter or action types?

  - A: Usually because the module type wasn't registered in `VuexStoreRootModules`, or the module `Mode`/`namespaced` setting is inconsistent between type and runtime implementation.

- Q: I use monorepo / pnpm — TypeScript can't find types. What now?
  - A: Ensure `typeRoots` and `paths` are configured, include the `.d.ts` in `tsconfig` `include`, and add a `paths` map for `vuex` if pnpm hoists differently (see PNPM section).

---
