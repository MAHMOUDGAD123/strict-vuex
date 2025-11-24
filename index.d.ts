import "vuex";
import type {
  App,
  WatchOptions,
  InjectionKey,
  WatchCallback,
  ComponentPublicInstance,
} from "vue";

// Custom Root Types Start
// ---------------------------------------------------------------

/**
 * Any types you add here will be reflected at the root `state` in the store.
 * @example
 * ```ts
 * interface VuexStoreRootState {
 *   prop1: string;
 *   prop1: number;
 *   ...
 * }
 *
 * // Usage:
 * this.$store.state.prop1 // string
 * this.$store.state.prop2 // number
 * ```
 */
export interface VuexStoreRootState {}

/**
 * Any types you add here will be reflected at the root `getters` in the store.
 * @example
 * ```ts
 * interface VuexStoreRootGetters {
 *   getter1: string;
 *   getter2: (x: number, y: number) => number;
 *   ...
 * }
 * ```
 * @info
 * - The `keys` of all pairs will be used as the getters callback names.
 * - The `values` of all pairs will be used as return value of the getters.
 * ```ts
 * // Usage:
 * const aString = this.$store.getters.getter1;
 * const aNumber = this.$store.getters.getter2(1, 2);
 * ```
 */
export interface VuexStoreRootGetters {}

/**
 * Any types you add here will be reflected at the root `actions` in the store.
 * ```ts
 * // The type of each pair must satisfies the next type alias
 * type ActionPair = Record<string, StoreActionRecord>;
 * ```
 * Use {@link StoreActionRecord} to define the action record.
 * @example
 * ```ts
 *  interface VuexStoreRootActions {
 *    action1: StoreActionRecord<{ value: string }, boolean>;
 *    action2: StoreActionRecord<{ prop1: number; prop2: string; }, 'yes' | 'no'>;
 *    ...
 *  }
 * ```
 * @info
 * - The `key` of all pairs will be used as the dipatches types.
 * - The `payload` of all pairs will be used as the dispatches payloads types.
 * - The `return` of all pairs will be used as the dispatches return types.
 * ```ts
 * // Usage:
 * const trueOrFalse = await this.$store.dispatch('action1', { value: 'data' });
 * const yesOrNo = await this.$store.dispatch('action2', { prop1: 10, prop2: 'data' });
 * ```
 */
export interface VuexStoreRootActions {}

/**
 * Any types you add here will be reflected at the root `mutations` in the store.
 *
 * ```ts
 * // The type of each pair must satisfies the next type alias.
 * // It's recommended to use a `key-value` pair as value.
 * type Mutation = { m: { val: number } }; // ✅ recommended
 * type Mutation = { m: number }; // ❌ not recommended
 * ```
 * @example
 * ```ts
 *  interface VuexStoreRootMutations {
 *    mutation1: { value: string };
 *    mutation2: { prop1: number; prop2: string; };
 *    ...
 *  }
 * ```
 * @info
 * - The `keys` of all pairs will be used as the commits types.
 * - The `values` of all pairs will be used as the commits payloads types.
 * ```ts
 * // Usage:
 * this.$store.commit('mutation1', { value: 'data' });
 * this.$store.commit('mutation2', { prop1: 10, prop2: 'data' });
 * ```
 */
export interface VuexStoreRootMutations {}

/**
 * Any types you add here will be reflected at the root `Modules` in the store.
 */
export interface VuexStoreRootModules {}

// Custom Root Types End
// ---------------------------------------------------------------

// Add typings for `this.$store` in vue module
declare module "vue" {
  interface ComponentCustomProperties {
    $store: _Store<StoreRootStateResolved, StoreRootGettersResolved>;
  }
}

// Customize vuex types
declare module "vuex" {
  /**
   * Creates a new store instance.
   * @param options store options {@link _StoreOptions} object.
   */
  declare function createStore<
    RootState = VuexStoreRootState,
    RootGetters = VuexStoreRootGetters
  >(
    options: _StoreOptions<RootState, RootGetters>
  ): _Store<StoreRootStateResolved, StoreRootGettersResolved>;

  /**
   * A Composition API equivalent of `this.$store` in the Options API.
   * @info Used to access the vuex store instance
   * @param injectKey Your custom injection key
   */
  declare function useStore<
    RootState = StoreRootStateResolved,
    RootGetters = StoreRootGettersResolved
  >(
    injectKey?: InjectionKey<_Store<RootState, RootGetters>> | string
  ): _Store<RootState, RootGetters>;

  declare const mapState: _StateMapper & _StateMapperWithNamespace;
  declare const mapGetters: _GettersMapper & _GettersMapperWithNamespace;
  declare const mapActions: _ActionsMapper & _ActionsMapperWithNamespace;
  declare const mapMutations: _MutationsMapper & _MutationsMapperWithNamespace;
  declare function createNamespacedHelpers<Namespace extends Namespaces>(
    namespace: Namespace
  ): _NamespacedMappers<Namespace>;

  declare function createLogger<
    State extends StoreRootStateResolved = StoreRootStateResolved,
    Getters extends StoreRootGettersResolved = StoreRootGettersResolved
  >(option?: _LoggerOption<State, Getters>): _Plugin<State, Getters>;
}

// Generic types Start
// ---------------------------------------------------------------

/**
 * Use this alias to define a typed action record for the store.
 * @info
 * - `Payload` -> is the payload type of the action callback.
 * - `Return` -> is the return type of the action callback.
 * - `root` -> define if the action is a root level action or not default is `false`.
 *
 * @info
 * ```ts
 * // Usage:
 * // It's recommended to use a `key-value` pair as value.
 * type ActionRecord = StoreActionRecord<{ val: string }, string>; // ✅
 * type ActionRecordRootLevel = StoreActionRecord<{ val: string }, string, true>; // ✅
 * type ActionRecord = StoreActionRecord<string, string>; // ❌
 * type RootLevelActionRecord = StoreActionRecord<string, string, true>; // ❌
 *
 * // if the actions is defined as root action `{ root: true }`.
 * // this means that if we have for example `(actionC)` defined as root action
 * // and we have the next modules tree
 * // moduleA -> moduleB -> moduleC(here)
 *
 * // So, you should do 2 things:
 *
 * // [1] Define the action as action object not as handler
 *
 * // like this ✅
 * const actionC: _ActionObject = {
 *   root: true,
 *   handler: async (ctx, payload) => {
 *     ctx.dispatch('actionAAA1', { valAAA1: ' (from actionAA)' }, { root: true });
 *     console.log('actionAA:', payload);
 *     return payload?.valAA ?? 'AA';
 *   }
 * }
 *
 * // not like this ❌
 * const actionA: _ActionHandler = (ctx, payload) => {}
 *
 * // [2] Access the action as root level action
 *
 * // like this ✅
 * $store.dispatch('actionC', payload);
 * context.dispatch('actionC', payload, { root: true })
 *
 * // not like this ❌
 * $store.dispatch('moduleA/moduleB/moduleC/actionC', payload);
 * context.dispatch('actionC', payload);
 * ```
 */
export interface StoreActionRecord<
  Payload,
  Return,
  RootLevel extends boolean = false
> {
  payload: Payload;
  return: Return;
  root: RootLevel;
}

type ModuleMode = "default" | "isolated";
type ModuleNamesWithRoot = "root" | ModuleNames;

type ModuleNamesGeneric = ModuleNames;
type StoreStateGeneric = Record<string, any>;
type StoreGettersGeneric = Record<string, any>;
type StoreActionsGeneric = Record<
  string,
  StoreActionRecord<Record<string, any> | null, any, boolean>
>;
type StoreMutationsGeneric = Record<string, Record<string, any> | null>;

// Generic types End
// ---------------------------------------------------------------

declare class _Store<
  RootState = StoreRootStateResolved,
  RootGetters = StoreRootGettersResolved
> {
  constructor(options: _StoreOptions<RootState, RootGetters>);

  /**
   * Access the current state (read-only reference).
   */
  readonly state: RootState;

  /**
   * Access computed getters defined in your store.
   */
  readonly getters: RootGetters;

  /**
   * Installs the store as a Vue plugin.
   * Used internally by
   * ```ts
   * app.use(store).
   * ```
   * @param app vue app instance
   * @param injectKey optinal custom injection key
   */
  install(
    app: App,
    injectKey?: InjectionKey<_Store<RootState, RootGetters>> | string
  ): void;

  /**
   * Completely replaces the entire root state object with a new one.
   * Useful for hydration and resets.
   * @param state store root state
   */
  replaceState(state: RootState): void;

  /**
   * Dispatches actions. Returns a Promise.
   */
  dispatch: _Dispatch;

  /**
   * Commits mutations to change state.
   */
  commit: _Commit;

  /**
   * Subscribes to mutations. Returns an unsubscribe function.
   * @param fn the callback function that called after the mutation handler completes successfully
   * @param options subscribe options
   */
  subscribe(
    fn: (mutation: MutationPayloadUnion, state: RootState) => any,
    options?: SubscribeOptions
  ): () => void;

  /**
   * Subscribes to actions with a callback or before/after/error hooks.
   * @param fn either an after callback or before/after/error hooks
   * @param options subscribe options
   * @info You have 2 overloads of the `fn` parameter:
   * ```ts
   * // [1] First overload - with full control
   * store.subscribeAction({
   * before: (action, state) => {
   *   console.log('Before action:', action.type);
   * },
   * after: (action, state) => {
   *   console.log('After action:', action.type);
   * },
   * error: (action, state, error) => {
   *   console.log('Action error:', action.type, error);
   * }
   * });
   *
   * // [2] Second overload - called after action completes
   * store.subscribeAction((action, state) => {
   *   console.log('Action completed:', action.type);
   * });
   *
   * // Equivalent to:
   * store.subscribeAction({
   *   after: (action, state) => {
   *     console.log('Action completed:', action.type);
   *   }
   * });
   * ```
   */
  subscribeAction(
    fn: _SubscribeActionOptions<ActionPayloadUnion, RootState>,
    options?: SubscribeOptions
  ): () => void;

  /**
   * Watches a getter or computed value. Returns an unsubscribe function.
   * @param getter the getter function that returns the watch value
   * @param cb the watch callback {@link WatchCallback}
   * @param options the watch options {@link WatchOptions}
   */
  watch<T>(
    getter: (state: RootState, getters: RootGetters) => T,
    cb: (value: T, oldValue: T) => void,
    options?: WatchOptions
  ): () => void;

  /**
   * Dynamically registers a module at runtime.
   * @param path the module path
   * @param module the module instance must be defined with {@link _Module}
   * @param options module options {@link ModuleOptions}
   *
   * @info You need to know how the module `path` works under the hood in vuex first.
   * ```ts
   * // This is a dummy mimic code for the internal vuex path logic with nested modules:
   * function getNestedModule(path) {
   *   if (typeof path === 'string') {
   *     // Assumes top-level only, looks directly at root.modules[path]
   *     return rootModules[path];
   *   } else if (Array.isArray(path)) {
   *     // Traverses the nested structure
   *     let module = rootModules[path[0]];
   *     for (let i = 1; i < path.length; i++) {
   *       module = module.modules[path[i]];
   *     }
   *     return module;
   *   }
   * }
   *
   * // Before anything 'isolated' (namespaced) modules doesn't effect the path
   * // at all like getters, actions, and mutations.
   *
   * // So, for example if we have a module tree like the next:
   * // root -> moduleA -> moduleB -> moduleC
   *
   * // # Path Structure
   * // The path represents the full chain from the root store to the target module:
   * // For moduleA (direct child of root):
   * //
   * // String: 'moduleA'
   * // String[]: ['moduleA']
   * //
   * // For moduleB (nested under moduleA):
   * //
   * // String: Not supported - must use array
   * // String[]: ['moduleA', 'moduleB']
   * //
   * // For moduleC (nested under moduleB):
   * //
   * // String: Not supported - must use array
   * // String[]: ['moduleA', 'moduleB', 'moduleC']
   *
   * // # Important Notes:
   * // 1- String paths only work for top-level modules (direct children of root)
   * // 2- Array paths must be used for any nested modules (2+ levels deep)
   * // 3- The path always starts from the root, not from the parent module
   *
   * // Examples
   *
   * store.hasModule('moduleA'); // true ✅
   * store.hasModule(['moduleA', 'moduleB']); // true ✅
   * store.hasModule(['moduleA', 'moduleB', 'moduleC']); // true ✅
   *
   * store.hasModule(['moduleA']); // true ✅
   * store.hasModule('moduleA/moduleB'); // false ❌
   * store.hasModule('moduleA/moduleB/moduleC'); // false ❌
   * ```
   */
  registerModule(
    path: ValidModulePaths,
    module: ModuleTypeUnion,
    options?: ModuleOptions
  ): void;

  /**
   * Dynamically unregister a module at runtime.
   * @param path the module path
   * @info for more info about paths see this type {@link registerModule}
   */
  unregisterModule(path: ValidModulePaths): void;

  /**
   * Check if a module is exists at runtime.
   * @param path the module path
   * @info for more info about paths see this type {@link registerModule}
   */
  hasModule(path: ValidModulePaths): boolean;

  /**
   * Updates store definitions for Hot Module Replacement (HMR) during development.
   * @param options root level options except state
   */
  hotUpdate(options: {
    actions?: _ActionTree<RootState, RootGetters, VuexStoreRootActions>;
    mutations?: _MutationTree<RootState, VuexStoreRootMutations>;
    getters?: _GetterTree<RootState, RootGetters, RootGetters>;
    modules?: Required<VuexStoreRootModules>;
  }): void;
}

/**
 * Configuration options for creating a Vuex store.
 *
 * This interface defines all available options when creating a store instance
 * with `createStore()`. It provides complete type safety for state, getters,
 * actions, mutations, and modules.
 *
 * @template RootState - The root state type (defaults to {@link VuexStoreRootState})
 * @template RootGetters - The root getters type (defaults to {@link VuexStoreRootGetters})
 *
 * @property state - The root state object or a factory function that returns it
 * @property getters - Computed values derived from state (optional)
 * @property actions - Asynchronous operations that can commit mutations (optional)
 * @property mutations - Synchronous functions that modify state (optional)
 * @property modules - Child modules for organizing store into namespaces (optional)
 * @property plugins - Plugin functions to extend store functionality (optional)
 * @property strict - Enable strict mode to throw errors for state mutations outside handlers (optional, default: false)
 * @property devtools - Enable Vue DevTools integration (optional, default: true)
 *
 * @example
 * ```ts
 * // Basic store
 * const options: _StoreOptions<{ count: number }, { double: number }> = {
 *   state: { count: 0 },
 *   getters: {
 *     double: (state) => state.count * 2
 *   },
 *   mutations: {
 *     increment: (state) => state.count++
 *   }
 * };
 *
 * // Store with modules
 * const options: _StoreOptions<RootState, RootGetters> = {
 *   state: () => ({ version: '1.0' }),
 *   modules: {
 *     user: userModule,
 *     cart: cartModule
 *   },
 *   plugins: [loggerPlugin],
 *   strict: process.env.NODE_ENV !== 'production'
 * };
 *
 * // Create store
 * const store = createStore(options);
 * ```
 *
 * @see {@link createStore} - Function that uses these options
 * @see {@link _Store} - The store instance type returned
 * @see {@link https://vuex.vuejs.org/api/#createstore|Vuex createStore API}
 */
export interface _StoreOptions<RootState, RootGetters> {
  state?: RootState | (() => RootState);
  // Pick only the the root getters but give the (StoreRootGettersResolved) to the callbacks getters
  getters?: _GetterTree<
    StoreRootStateResolved,
    RootGetters,
    StoreRootGettersResolved
  >;
  actions?: _ActionTree<
    StoreRootStateResolved,
    StoreRootGettersResolved,
    VuexStoreRootActions
  >;
  mutations?: _MutationTree<StoreRootStateResolved, VuexStoreRootMutations>;
  modules?: VuexStoreRootModules;
  plugins?: _Plugin<StoreRootStateResolved, StoreRootGettersResolved>[];
  strict?: boolean;
  devtools?: boolean;
}

/**
 * A Vuex store plugin function.
 *
 * Plugins are functions that receive the store instance and can:
 * - Subscribe to mutations via `store.subscribe()`
 * - Subscribe to actions via `store.subscribeAction()`
 * - Access and modify state (use with caution)
 * - Dispatch actions or commit mutations
 * - Add custom functionality to the store
 *
 * @template State - The root state type of the store (defaults to {@link StoreRootStateResolved})
 * @template Getters - The root getters type of the store (defaults to {@link StoreRootGettersResolved})
 *
 * @param store - The Vuex store instance
 * @returns Any value (typically void or an unsubscribe function)
 *
 * @example
 * ```ts
 * // Simple logging plugin
 * const myPlugin: _Plugin = (store) => {
 *   store.subscribe((mutation, state) => {
 *     console.log('Mutation:', mutation.type);
 *     console.log('New state:', state);
 *   });
 * };
 *
 * // Usage in store
 * const store = createStore({
 *   state: { count: 0 },
 *   plugins: [myPlugin]
 * });
 * ```
 *
 * @see {@link https://vuex.vuejs.org/guide/plugins.html|Vuex Plugins Documentation}
 */
export type _Plugin<
  State = StoreRootStateResolved,
  Getters = StoreRootGettersResolved
> = (store: _Store<State, Getters>) => any;

interface _Payload<T = string> {
  type: T;
}

interface _MutationPayload<M extends keyof StoreRootMutationsResolved>
  extends _Payload<M> {
  // type: M;
  payload: StoreRootMutationsResolved[M];
}

interface _ActionPayload<A extends keyof StoreRootActionsResolved>
  extends _Payload<A> {
  // type: A;
  payload: StoreRootActionsResolved[A]["payload"];
}

/**
 * All possible mutation payloads union.
 * @info Used with store `subscribe()` function.
 */
type MutationPayloadUnion = {
  [K in keyof StoreRootMutationsResolved]: {
    type: K;
    payload: StoreRootMutationsResolved[K];
  };
}[keyof StoreRootMutationsResolved];

/**
 * All possible action payloads union.
 * @info Used with store `subscribeAction()` function.
 */
type ActionPayloadUnion = {
  [K in keyof StoreRootActionsResolved]: {
    type: K;
    payload: StoreRootActionsResolved[K]["payload"];
  };
}[keyof StoreRootActionsResolved];

type _ActionSubscriber<Payload, State> = (action: Payload, state: State) => any;
type _ActionErrorSubscriber<Payload, State> = (
  action: Payload,
  state: State,
  error: Error
) => any;

interface _ActionSubscribersObject<Payload, State> {
  /**
   * Called before the action handler is invoked.
   */
  before?: _ActionSubscriber<Payload, State>;
  /**
   * Called after the action handler completes successfully.
   */
  after?: _ActionSubscriber<Payload, State>;
  /**
   * Called if the action handler throws an error or returns a rejected Promise.
   */
  error?: _ActionErrorSubscriber<Payload, State>;
}

type _SubscribeActionOptions<Payload, State> =
  | _ActionSubscriber<Payload, State>
  | _ActionSubscribersObject<Payload, State>;

// Getters Start
// ---------------------------------------------------------------

type _Getter<State, Getters, Return> = (
  state: State,
  getters: Getters,
  rootState: StoreRootStateResolved,
  rootGetters: StoreRootGettersResolved
) => Return;

/**
 * - `Getters` -- is the actual getters callbacks in the module.
 * - `GettersParameter` -- is the `getters` parameter in the callback itself.
 * ```ts
 *  getterCallback(state, [`GettersParameter`], rootState, rootGetters): any
 * ```
 */
type _GetterTree<State, Getters, GettersParameter> = {
  [K in keyof Getters]: _Getter<State, GettersParameter, Getters[K]>;
};

// Getters End
// ---------------------------------------------------------------

// Actions & Dispatch & Context Start
// ---------------------------------------------------------------

type _ActionContextDispatch<ModuleName extends ModuleNamesWithRoot> = <
  Action extends
    | keyof ModulesActionsMapResolved[ModuleName]
    | keyof StoreRootActionsResolved
>(
  type: Action,
  payload?:
    | (Action extends keyof ModulesActionsMapResolved[ModuleName]
        ? ModulesActionsMapResolved[ModuleName][Action]["payload"]
        : Action extends keyof StoreRootActionsResolved
        ? StoreRootActionsResolved[Action]["payload"]
        : never)
    | null,
  ...args: Action extends keyof ModulesActionsMapResolved[ModuleName]
    ? ModulesActionsMapResolved[ModuleName][Action] extends { root: true }
      ? [options: { root: true }] // Root-flagged actions always need { root: true }
      : [options?: { root: false }] // Natural non-root actions, options optional
    : [options: { root: true }] // Not in natural scope, requires { root: true }
) => Promise<
  Action extends keyof ModulesActionsMapResolved[ModuleName]
    ? ModulesActionsMapResolved[ModuleName][Action]["return"]
    : Action extends keyof StoreRootActionsResolved
    ? StoreRootActionsResolved[Action]["return"]
    : never
>;

type _ActionContextCommit<ModuleName extends ModuleNamesWithRoot> = <
  Mutation extends
    | keyof ModulesMutationsMapResolved[ModuleName]
    | keyof StoreRootMutationsResolved
>(
  type: Mutation,
  payload?:
    | (Mutation extends keyof ModulesMutationsMapResolved[ModuleName]
        ? ModulesMutationsMapResolved[ModuleName][Mutation]
        : Mutation extends keyof StoreRootMutationsResolved
        ? StoreRootMutationsResolved[Mutation]
        : never)
    | null,
  ...args: Mutation extends keyof ModulesMutationsMapResolved[ModuleName]
    ? [options?: { root: false; silent?: boolean }] // Natural mutations, options optional
    : [options: { root: true; silent?: boolean }] // Not in natural scope, requires { root: true }
) => void;

interface _ActionContext<State, Getters, ModuleName> {
  // Use the default _Dispatch & _Commit type if on the 'root' level
  dispatch: ModuleName extends "root"
    ? _Dispatch
    : _ActionContextDispatch<ModuleName>;
  commit: ModuleName extends "root"
    ? _Commit
    : _ActionContextCommit<ModuleName>;
  state: State;
  getters: Getters;
  rootState: StoreRootStateResolved;
  rootGetters: StoreRootGettersResolved;
}

interface _ActionObject<
  State,
  Getters,
  Payload,
  Return,
  ModuleName,
  RootLevel extends boolean
> {
  root?: RootLevel;
  handler: _ActionHandler<State, Getters, Payload, Return, ModuleName>;
}

type _ActionHandler<State, Getters, Payload, Return, ModuleName> = (
  this: _Store,
  ctx: _ActionContext<State, Getters, ModuleName>,
  payload?: Payload | null
) => Return | Promise<Return>;

type _Action<
  State,
  Getters,
  Payload,
  Return,
  ModuleName,
  RootLevel extends boolean
> =
  | _ActionHandler<State, Getters, Payload, Return, ModuleName>
  | _ActionObject<State, Getters, Payload, Return, ModuleName, RootLevel>;

type _ActionTree<
  State,
  Getters,
  Actions extends StoreActionsGeneric,
  ModuleName extends ModuleNamesWithRoot = "root"
> = {
  [K in keyof Actions]: Actions[K] extends { root: true }
    ? // force define the action as _ActionObject only if it is a root action
      Required<
        _ActionObject<
          State,
          Getters,
          Actions[K]["payload"],
          Actions[K]["return"],
          ModuleName,
          true
        >
      >
    : // else both ways are valid
      _Action<
        State,
        Getters,
        Actions[K]["payload"],
        Actions[K]["return"],
        ModuleName,
        false
      >;
};

/** A custom version of {@link Dispatch} interface. */
interface _Dispatch {
  /**
   * It's `recommended` to use this overload ✅.
   */
  <A extends keyof StoreRootActionsResolved>(
    type: A,
    payload?: StoreRootActionsResolved[A]["payload"] | null,
    options?: DispatchOptions
  ): Promise<StoreRootActionsResolved[A]["return"]>;

  // /**
  //  * This overload is not `recommended` to use 💩
  //  * @info
  //  * Use this overload with the {@link _TypedActionPayload}
  //  * @info
  //  * You have to provide the second type argument with same type as provided to the {@link _TypedActionPayload} to make TypeScript infer the return type for you.
  //  * @example
  //  * ```ts
  //  * this.$store.dispatch<_TypedActionPayload<'updateAge'>, 'updateAge'>({
  //       type: 'updateAge',
  //       value: 30,
  //     });
  //  * ```
  //  */
  // <Payload extends _Payload, A extends keyof StoreRootActionsResolved>(
  //   payloadWithType: Payload,
  //   options?: DispatchOptions,
  // ): Promise<VuexStoreRootActions[A]['return']>;
}

/** Use it to gererate a typed Action. */
type _TypedActionPayload<A extends keyof StoreRootActionsResolved> =
  StoreRootActionsResolved[A]["payload"] & { type: A };

// Actions & Dispatch & Context End
// ---------------------------------------------------------------

// Mutations & Commit Start
// ---------------------------------------------------------------

type _Mutation<State, Payload> = (
  state: State,
  payload?: Payload | null
) => any;

type _MutationTree<State, Mutations extends StoreMutationsGeneric> = {
  [K in keyof Mutations]: _Mutation<State, Mutations[K]>;
};

/** A custom version of {@link Commit} interface. */
interface _Commit {
  /**
   * It's `recommended` to use this overload ✅.
   */
  <M extends keyof StoreRootMutationsResolved>(
    type: M,
    payload?: StoreRootMutationsResolved[M] | null,
    options?: CommitOptions
  ): void;

  // /**
  //  * This overload is not `recommended` to use 💩
  //  * @info
  //  * Only use this overload with the {@link _TypedMutationPayload}
  //  * @example
  //  * ```ts
  //  * this.$store.commit<_TypedMutationPayload<'updateAge'>>({
  //       type: 'updateAge',
  //       value: 30,
  //     });
  //  * ```
  //  */
  // <Payload extends _Payload>(payloadWithType: Payload, options?: CommitOptions): void;
}

/** Use it to gererate a typed Mutation. */
type _TypedMutationPayload<M extends keyof StoreRootMutationsResolved> =
  StoreRootMutationsResolved[M] & { type: M };

// Mutations & Commit End
// ---------------------------------------------------------------

// Modules Start
// ---------------------------------------------------------------

/**
 *  A custom version of {@link Module} interface.
 * - `ModuleName`: must be the same as the name of the runtime module
 * - `Mode`: `default` -> (namespaced: false) | `isolated` -> (namespaced: true)
 * - `State`: the module state
 * - `Getters`: the module getters
 * - `Actions`: the actions of the module - must be defined by {@link StoreActionRecord}
 * - `Mutations`: the module mutations
 * - `modules`: the module's children `undefined` by default
 *
 * @example
 * ```ts
 * type ModuleA = _Module<
 *  'moduleA',
 *  'isolated',
 *  { stateA: string },
 *  { getterA: string },
 *  { actionA: StoreActionRecord<{ valA: string }, string, true> },
 *  { MUTATION_A: { valA: string } },
 *  { moduleA1: ModuleA1; moduleA2: ModuleA2 }
 * >
 *
 * const moduleA: ModuleA = {
 *   namespaced: true,
 *   state: { a: 'Module A' },
 *   getters: { getterA(state) {} },
 *   actions: {
 *     actionA: {
 *       root: true,
 *       handler: async (ctx, payload) => {},
 *     },
 *   },
 *   mutations: { MUTATION_A(state, payload) {} },
 *   modules: { moduleAA },
 * };
 * ```
 */
export interface _Module<
  ModuleName extends ModuleNamesGeneric,
  Mode extends ModuleMode,
  State extends StoreStateGeneric = StoreStateGeneric,
  Getters extends StoreGettersGeneric = StoreGettersGeneric,
  Actions extends StoreActionsGeneric = StoreActionsGeneric,
  Mutations extends StoreMutationsGeneric = StoreMutationsGeneric,
  Modules = undefined // must be undefined by default
> {
  namespaced: Mode extends "default" ? false : true;

  state?: State | (() => State);

  getters?: _GetterTree<
    State &
      (Modules extends undefined
        ? {} // Get nothing if undefined
        : {
            [K in keyof Modules]: ResolveModuleState<Modules[K]>; // Get only the children modules state
          }),
    Getters,
    ModulesGettersMapResolved[ModuleName]
  >;

  actions?: _ActionTree<
    State &
      (Modules extends undefined
        ? {} // Get nothing if undefined
        : {
            [K in keyof Modules]: ResolveModuleState<Modules[K]>; // Get only the children modules state
          }),
    ModulesGettersMapResolved[ModuleName],
    Actions,
    ModuleName
  >;

  mutations?: _MutationTree<
    State &
      (Modules extends undefined
        ? {} // Get nothing if undefined
        : {
            [K in keyof Modules]: ResolveModuleState<Modules[K]>; // Get only the children modules state
          }),
    Mutations
  >;

  modules?: Modules;
}

// Modules End
// ---------------------------------------------------------------

// Nested Modules Issue Fix
// ==================================================================
// ========================= Issue Start ============================
// ==================================================================

// State Fix Start
// ------------------------------------------------------------------

type ExtractState<T> = T extends () => infer S ? S : T extends object ? T : {};

type ResolveModuleState<M> = M extends _Module<
  any,
  any,
  infer State,
  any,
  any,
  any,
  infer Modules
>
  ? ExtractState<State> &
      (Modules extends undefined
        ? {} // Last module (no children)
        : Modules extends object
        ? {
            [K in keyof Required<Modules>]: ResolveModuleState<
              Required<Modules>[K]
            >;
          }
        : {})
  : {};

type StoreRootStateResolved = VuexStoreRootState & {
  [K in keyof Required<VuexStoreRootModules>]: ResolveModuleState<
    Required<VuexStoreRootModules>[K]
  >;
};

/**
 * Build a complete state resolution map for all modules by name
 * This traverses the module tree and creates a mapping of module names to their complete state trees
 */
type BuildModulesStateMap<
  Modules,
  ParentPath extends string = ""
> = Modules extends undefined
  ? {}
  : Modules extends object
  ? UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          any,
          infer Mode,
          infer State,
          any,
          any,
          any,
          infer Children
        >
          ? {
              // Map the module name to its complete resolved state
              [ModuleName in K]: ExtractState<State> &
                (Children extends undefined
                  ? {} // No children, just own state
                  : Children extends object
                  ? {
                      // Include children states as nested properties
                      [ChildKey in keyof Required<Children>]: Required<Children>[ChildKey] extends _Module<
                        any,
                        any,
                        any,
                        any,
                        any,
                        any,
                        any
                      >
                        ? ResolveModuleState<Required<Children>[ChildKey]>
                        : never;
                    }
                  : {});
            } & BuildModulesStateMap<Children> // Recurse into children
          : {};
      }[keyof Required<Modules>]
    >
  : {};

/**
 * Global modules state map
 * Maps each module name to its complete state tree (including nested children states)
 *
 * @example
 * ```ts
 * // If we have: moduleA -> moduleB -> moduleC
 * // - moduleA state: { a: string }
 * // - moduleB state: { b: string }
 * // - moduleC state: { c: string }
 *
 *  Then:
 * type Test1 = ModulesStateMapResolved['moduleA'] // => { a: string, moduleB: { b: string, moduleC: { c: string } } }
 * type Test2 = ModulesStateMapResolved['moduleB'] // => { b: string, moduleC: { c: string } }
 * type Test3 = ModulesStateMapResolved['moduleC'] // => { c: string }
 * ```
 */
type ModulesStateMapResolved = BuildModulesStateMap<
  Required<VuexStoreRootModules>
> & {
  root: StoreRootStateResolved; // Add root state mapping
};

/**
 * Extract the complete state tree for a module by its name
 * Includes the module's own state and all nested children states
 *
 * @example
 * ```ts
 * type StateB = ResolveModuleStateByName<'moduleB'>
 * // Result: { b: string, moduleC: { c: string } }
 *
 * // Usage in components or actions:
 * const moduleState: ResolveModuleStateByName<'moduleB'> = // ...
 * console.log(moduleState.b) // string
 * console.log(moduleState.moduleC.c) // string
 * ```
 */
export type ResolveModuleStateByName<ModuleName extends ModuleNames | "root"> =
  ModuleName extends keyof ModulesStateMapResolved
    ? ModulesStateMapResolved[ModuleName]
    : never;

// State Fix End
// ------------------------------------------------------------------

// Getters Fix Start
// ------------------------------------------------------------------

/* [1] Fix the root getters */
// ##################################################################

type ResolveModuleGetters<M, Path extends string = ""> = M extends _Module<
  any,
  infer Mode,
  any,
  infer Getters,
  any,
  any,
  infer Modules
>
  ? (Getters extends object
      ? Path extends ""
        ? Getters // Root level non-namespaced getters
        : { [K in keyof Getters as `${Path}/${K & string}`]: Getters[K] }
      : {}) &
      (Modules extends object
        ? UnionToIntersection<
            {
              [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
                any,
                infer ChildMode,
                any,
                any,
                any,
                any,
                any
              >
                ? ResolveModuleGetters<
                    Required<Modules>[K],
                    ChildMode extends "isolated"
                      ? `${Path}${Path extends "" ? "" : "/"}${K & string}`
                      : Path
                  >
                : {};
            }[keyof Required<Modules>]
          >
        : {})
  : {};

type StoreRootGettersResolved = VuexStoreRootGetters &
  UnionToIntersection<
    {
      [K in keyof Required<VuexStoreRootModules>]: Required<VuexStoreRootModules>[K] extends _Module<
        any,
        infer Mode,
        any,
        any,
        any,
        any,
        any
      >
        ? ResolveModuleGetters<
            Required<VuexStoreRootModules>[K],
            Mode extends "isolated" ? K & string : ""
          >
        : {};
    }[keyof Required<VuexStoreRootModules>]
  >;

// ##################################################################

/* [2] Fix accessible getters in module (getters and actions context) callbacks parameters */
// ##################################################################

// Collect child getters with proper prefixing
type CollectChildGetters<
  Children,
  ParentScope,
  CurrentPath extends string = ""
> = Children extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Children]: Children[K] extends _Module<
          any,
          infer Mode,
          any,
          infer Getters,
          any,
          any,
          infer GrandChildren
        >
          ? Mode extends "isolated"
            ? // Isolated: add to path and recurse with new path
              PrefixHelper<
                Getters,
                `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                  string}`
              > &
                CollectChildGetters<
                  GrandChildren,
                  Getters,
                  `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                    string}`
                >
            : // Default: keep current path (don't reset, don't add)
              PrefixHelper<Getters, CurrentPath> &
                CollectChildGetters<
                  GrandChildren,
                  ParentScope & Getters,
                  CurrentPath
                >
          : {};
      }[keyof Children]
    >;

// Build the complete getter map for all modules
type BuildModulesGetterMap<
  Modules,
  ParentGetters = VuexStoreRootGetters,
  HasRootAccess extends boolean = true, // Track root access explicitly
  CurrentPath extends string = ""
> = Modules extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          any,
          infer Mode,
          any,
          infer Getters,
          any,
          any,
          infer Children
        >
          ? Mode extends "isolated"
            ? {
                // Isolated module entry - no root access
                [ModuleName in K]: Getters &
                  CollectChildGetters<Required<Children>, Getters>;
              } & BuildModulesGetterMap<Required<Children>, Getters, false> // Recurse into children with no root access
            : {
                // Default module entry - check if we have root access
                [ModuleName in K]: (HasRootAccess extends true
                  ? StoreRootGettersResolved
                  : ParentGetters) &
                  Getters &
                  CollectChildGetters<
                    Required<Children>,
                    HasRootAccess extends true
                      ? StoreRootGettersResolved & Getters
                      : ParentGetters & Getters
                  >;
              } & BuildModulesGetterMap<
                // Recurse into children - maintain root access flag
                Required<Children>,
                HasRootAccess extends true
                  ? StoreRootGettersResolved & Getters
                  : ParentGetters & Getters,
                HasRootAccess
              >
          : {};
      }[keyof Required<Modules>]
    >;

/**
 * global modules getter map
 * This is a magical type that maps each module with it's getters 😎
 * Start with root `access = true`
 */
type ModulesGettersMapResolved = BuildModulesGetterMap<
  Required<VuexStoreRootModules>,
  VuexStoreRootGetters,
  true
>;

// ##################################################################

// Getters Fix End
// ------------------------------------------------------------------

// Mutations Fix Start
// ------------------------------------------------------------------

/* [1] Fix the root mutations */
// ##################################################################

type ResolveModuleMutations<M, Path extends string = ""> = M extends _Module<
  any,
  infer Mode,
  any,
  any,
  any,
  infer Mutations,
  infer Modules
>
  ? (Mutations extends object
      ? Path extends ""
        ? Mutations // Root level non-namespaced mutations
        : { [K in keyof Mutations as `${Path}/${K & string}`]: Mutations[K] }
      : {}) &
      (Modules extends object
        ? UnionToIntersection<
            {
              [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
                any,
                infer ChildMode,
                any,
                any,
                any,
                any,
                any
              >
                ? ResolveModuleMutations<
                    Required<Modules>[K],
                    ChildMode extends "isolated"
                      ? `${Path}${Path extends "" ? "" : "/"}${K & string}`
                      : Path
                  >
                : {};
            }[keyof Required<Modules>]
          >
        : {})
  : {};

type StoreRootMutationsResolved = VuexStoreRootMutations &
  UnionToIntersection<
    {
      [K in keyof Required<VuexStoreRootModules>]: Required<VuexStoreRootModules>[K] extends _Module<
        any,
        infer Mode,
        any,
        any,
        any,
        any,
        any
      >
        ? ResolveModuleMutations<
            Required<VuexStoreRootModules>[K],
            Mode extends "isolated" ? K & string : ""
          >
        : {};
    }[keyof Required<VuexStoreRootModules>]
  >;

// ##################################################################

/* [2] Fix accessible mutations in module actions callbacks context parameter */
// ##################################################################

// Collect child mutations with proper prefixing
type CollectChildMutations<
  Children,
  ParentScope,
  CurrentPath extends string = ""
> = Children extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Children]: Children[K] extends _Module<
          any,
          infer Mode,
          any,
          any,
          any,
          infer Mutations,
          infer GrandChildren
        >
          ? Mode extends "isolated"
            ? // Isolated: add to path and recurse with new path
              PrefixHelper<
                Mutations,
                `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                  string}`
              > &
                CollectChildMutations<
                  GrandChildren,
                  Mutations,
                  `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                    string}`
                >
            : // Default: keep current path (don't reset, don't add)
              PrefixHelper<Mutations, CurrentPath> &
                CollectChildMutations<
                  GrandChildren,
                  ParentScope & Mutations,
                  CurrentPath
                >
          : {};
      }[keyof Children]
    >;

// Build the complete mutation map for all modules
type BuildModulesMutationMap<
  Modules,
  ParentMutations = VuexStoreRootMutations,
  HasRootAccess extends boolean = true, // Track root access explicitly
  CurrentPath extends string = ""
> = Modules extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          any,
          infer Mode,
          any,
          any,
          any,
          infer Mutations,
          infer Children
        >
          ? Mode extends "isolated"
            ? {
                // Isolated module entry - no root access
                [ModuleName in K]: Mutations &
                  CollectChildMutations<Required<Children>, Mutations>;
              } & BuildModulesMutationMap<Required<Children>, Mutations, false> // Recurse into children with no root access
            : {
                // Default module entry - check if we have root access
                [ModuleName in K]: (HasRootAccess extends true
                  ? StoreRootMutationsResolved
                  : ParentMutations) &
                  Mutations &
                  CollectChildMutations<
                    Required<Children>,
                    HasRootAccess extends true
                      ? StoreRootMutationsResolved & Mutations
                      : ParentMutations & Mutations
                  >;
              } & BuildModulesMutationMap<
                // Recurse into children - maintain root access flag
                Required<Children>,
                HasRootAccess extends true
                  ? StoreRootMutationsResolved & Mutations
                  : ParentMutations & Mutations,
                HasRootAccess
              >
          : {};
      }[keyof Required<Modules>]
    >;

/**
 * global modules mutation map
 * This is a magical type that maps each module with it's mutations 😎
 * Start with root access = true
 */
type ModulesMutationsMapResolved = BuildModulesMutationMap<
  Required<VuexStoreRootModules>,
  VuexStoreRootMutations,
  true
>;

// ##################################################################

// Mutations Fix End
// ------------------------------------------------------------------

// Actions Fix Start
// ------------------------------------------------------------------

/* [1] Fix the root actions */
// ##################################################################

// Helper to extract root actions (no prefix needed)
type ExtractRootActions<Actions> = Actions extends object
  ? {
      [K in keyof Actions as Actions[K] extends { root: true }
        ? K & string
        : never]: Actions[K];
    }
  : {};

// Helper to extract non-root actions (need prefix)
type ExtractNonRootActions<Actions> = Actions extends object
  ? {
      [K in keyof Actions as Actions[K] extends { root: true }
        ? never
        : K & string]: Actions[K];
    }
  : {};

type ResolveModuleActions<M, Path extends string = ""> = M extends _Module<
  any,
  infer Mode,
  any,
  any,
  infer Actions,
  any,
  infer Modules
>
  ? (Actions extends object
      ? // Root actions always at root level (no prefix)
        ExtractRootActions<Actions> &
          // Non-root actions get prefixed based on path
          (Path extends ""
            ? ExtractNonRootActions<Actions>
            : {
                [K in keyof ExtractNonRootActions<Actions> as `${Path}/${K &
                  string}`]: ExtractNonRootActions<Actions>[K];
              })
      : {}) &
      (Modules extends object
        ? UnionToIntersection<
            {
              [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
                any,
                infer ChildMode,
                any,
                any,
                any,
                any,
                any
              >
                ? ResolveModuleActions<
                    Required<Modules>[K],
                    ChildMode extends "isolated"
                      ? `${Path}${Path extends "" ? "" : "/"}${K & string}`
                      : Path
                  >
                : {};
            }[keyof Required<Modules>]
          >
        : {})
  : {};

type StoreRootActionsResolved = VuexStoreRootActions &
  UnionToIntersection<
    {
      [K in keyof Required<VuexStoreRootModules>]: Required<VuexStoreRootModules>[K] extends _Module<
        any,
        infer Mode,
        any,
        any,
        any,
        any,
        any
      >
        ? ResolveModuleActions<
            Required<VuexStoreRootModules>[K],
            Mode extends "isolated" ? K & string : ""
          >
        : {};
    }[keyof Required<VuexStoreRootModules>]
  >;

// ##################################################################

/* [2] Fix accessible actions in module actions callbacks context parameter */
// ##################################################################

// Collect child actions with proper prefixing
type CollectChildActions<
  Children,
  ParentScope,
  CurrentPath extends string = ""
> = Children extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Children]: Children[K] extends _Module<
          any,
          infer Mode,
          any,
          any,
          infer Actions,
          any,
          infer GrandChildren
        >
          ? Mode extends "isolated"
            ? // Isolated: root actions go to root, non-root actions get prefixed
              ExtractRootActions<Actions> & // Keep root actions at root level (no prefix)
                PrefixHelper<
                  ExtractNonRootActions<Actions>,
                  `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                    string}`
                > &
                CollectChildActions<
                  GrandChildren,
                  Actions, // Pass all actions
                  `${CurrentPath}${CurrentPath extends "" ? "" : "/"}${K &
                    string}`
                >
            : // Default: root actions stay at root, non-root actions keep current path
              ExtractRootActions<Actions> & // Keep root actions at root level (no prefix)
                PrefixHelper<ExtractNonRootActions<Actions>, CurrentPath> &
                CollectChildActions<
                  GrandChildren,
                  ParentScope & Actions, // Pass all actions
                  CurrentPath
                >
          : {};
      }[keyof Children]
    >;

// Build the complete action map for all modules
type BuildModulesActionMap<
  Modules,
  ParentActions = VuexStoreRootActions,
  HasRootAccess extends boolean = true,
  CurrentPath extends string = ""
> = Modules extends undefined
  ? {}
  : UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          any,
          infer Mode,
          any,
          any,
          infer Actions,
          any,
          infer Children
        >
          ? Mode extends "isolated"
            ? {
                // Isolated module entry - includes ALL own actions + non-root children
                [ModuleName in K]: Actions &
                  CollectChildActions<Required<Children>, Actions>;
              } & BuildModulesActionMap<Required<Children>, Actions, false> // Pass ALL actions, not just non-root
            : {
                // Default module entry - check if we have root access
                [ModuleName in K]: (HasRootAccess extends true
                  ? StoreRootActionsResolved // Has root access: gets all root actions
                  : ParentActions) & // No root access: only parent actions
                  Actions & // Own actions (including root ones)
                  CollectChildActions<
                    Required<Children>,
                    HasRootAccess extends true
                      ? StoreRootActionsResolved & Actions // Pass ALL actions
                      : ParentActions & Actions
                  >;
              } & BuildModulesActionMap<
                Required<Children>,
                HasRootAccess extends true
                  ? StoreRootActionsResolved & Actions // Pass ALL actions
                  : ParentActions & Actions,
                HasRootAccess
              >
          : {};
      }[keyof Required<Modules>]
    >;

// global modules action map
type ModulesActionsMapResolved = BuildModulesActionMap<
  Required<VuexStoreRootModules>,
  VuexStoreRootActions,
  true
>;

// ##################################################################

// Actions Fix End
// ------------------------------------------------------------------

// Module Path Fix Start
// for (hasModule & registerModule & unregisterModule)
// ------------------------------------------------------------------

/**
 * Union of all module names in the store.
 * @example `'moduleA' | 'moduleB' | 'moduleC'`
 */
export type ModuleNames = keyof ModulesInfoNameMap;

/**
 * Union of all module paths as strings.
 * @example `'moduleA' | 'moduleA/moduleB' | 'moduleA/moduleB/moduleC'`
 */
export type ModulePaths = keyof ModulesInfoPathMap;

/**
 * Module paths converted to tuple format.
 * @example `['moduleA'] | ['moduleA', 'moduleB'] | ['moduleA', 'moduleB', 'moduleC']`
 */
export type ModulePathTuples = PathToTuple<ModulePaths>;

/**
 * A map includes all modules with their name as keys
 */
type ModulesInfoNameMap = ExtractModulesInfoNameMap<
  Required<VuexStoreRootModules>
>;

/**
 * A map includes all modules with their full paths as keys
 */
type ModulesInfoPathMap = {
  [K in keyof ModulesInfoNameMap as ModulesInfoNameMap[K]["path"]]: ModulesInfoNameMap[K];
};

/**
 * All valid module paths for use with `registerModule()`, `unregisterModule()`, and `hasModule()`.
 *
 * Can be a string (for top-level modules) or string array (for nested modules).
 * @example `'moduleA' | ['moduleA'] | ['moduleA', 'moduleB'] | ['moduleA', 'moduleB', 'moduleC']`
 */
export type ValidModulePaths = {
  [K in keyof ModulesInfoNameMap]: IsGreaterOrEqual1<
    ModulesInfoNameMap[K]["depth"]
  > extends false
    ? K | [K]
    : PathToTuple<ModulesInfoNameMap[K]["path"]>;
}[keyof ModulesInfoNameMap];

/**
 * Extract complete module information with module name as key
 */
type ExtractModulesInfoNameMap<
  Modules,
  ParentPath extends string = "",
  ParentName extends string | null = null,
  ParentMode extends ModuleMode = "default",
  CurrentDepth extends number = 0
> = Modules extends undefined
  ? {}
  : Modules extends object
  ? UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          any,
          infer Mode,
          infer State,
          infer Getters,
          infer Actions,
          infer Mutations,
          infer Children
        >
          ? {
              // Current module entry
              [ModuleName in K]: {
                path: ParentPath extends ""
                  ? K & string
                  : `${ParentPath}/${K & string}`;
                mode: Mode;
                depth: CurrentDepth;
                hasChildren: Children extends undefined ? false : true;
                parentName: ParentName;
                parentPath: ParentPath extends "" ? null : ParentPath;
                state: State;
                getters: Getters;
                actions: Actions;
                mutations: Mutations;
                children: Children extends undefined ? null : Children;
              };
            } & ExtractModulesInfoNameMap<
              Children,
              ParentPath extends ""
                ? K & string
                : `${ParentPath}/${K & string}`,
              K & string,
              Mode,
              Increment<CurrentDepth>
            >
          : {};
      }[keyof Required<Modules>]
    >
  : {};

/**
 * Get module info by module name
 */
type GetModuleInfoByName<Name extends keyof ModulesInfoNameMap> =
  ModulesInfoNameMap[Name];

/**
 * Get module info by module path
 */
type GetModuleInfoByPath<Path extends keyof ModulesInfoPathMap> =
  ModulesInfoPathMap[Path];

/**
 * Get module {@link _Module} type by path
 */
type GetModuleTypeByPath<Path extends ModulePaths> = _Module<
  ModulesInfoPathMap[Path]["moduleName"],
  ModulesInfoPathMap[Path]["mode"],
  ModulesInfoPathMap[Path]["state"],
  ModulesInfoPathMap[Path]["getters"],
  ModulesInfoPathMap[Path]["actions"],
  ModulesInfoPathMap[Path]["mutations"],
  ModulesInfoPathMap[Path][children]
>;

/**
 * Get the complete module type definition by its name.
 * @template Name - The module name
 * @example
 * ```ts
 * type ModuleA = GetModuleTypeByName<'moduleA'>; // returns the full `_Module` type for moduleA
 * ```
 */
export type GetModuleTypeByName<Name extends ModuleNames> = _Module<
  Name,
  ModulesInfoNameMap[Name]["mode"],
  ModulesInfoNameMap[Name]["state"],
  ModulesInfoNameMap[Name]["getters"],
  ModulesInfoNameMap[Name]["actions"],
  ModulesInfoNameMap[Name]["mutations"],
  ModulesInfoNameMap[Name][children]
>;

/**
 * Holds all possible {@link _Module} types as union
 */
export type ModuleTypeUnion = {
  [K in keyof ModulesInfoNameMap]: GetModuleTypeByName<K>;
}[keyof ModulesInfoNameMap];

/**
 * Converts a path string to a tuple by splitting on '/'
 */
type PathToTuple<T extends string> = T extends `${infer First}/${infer Rest}`
  ? [First, ...PathToTuple<Rest>]
  : [T];

/**
 * Convert tuple back to path string
 */
type TupleToPath<T extends readonly string[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends string
    ? Rest extends readonly string[]
      ? Rest["length"] extends 0
        ? First
        : `${First}/${TupleToPath<Rest>}`
      : never
    : never
  : "";

/**
 * Converts a module name to its path as a tuple.
 * @template Name - The module name
 *
 * @example
 * ```ts
 * type Tuple = NameToTuple<'moduleC'>; // returns ['moduleA', 'moduleB', 'moduleC']
 * ```
 */
export type NameToTuple<Name extends ModuleNames> = PathToTuple<
  ModulesInfoNameMap[Name]["path"]
>;

// Module Path Fix End
// ------------------------------------------------------------------

// Module Namespace Fix Start (for Mappers)
// ------------------------------------------------------------------

type BuildNamespaceMap<
  Modules,
  ParentNamespace extends string = "",
  ParentPath extends string = "",
  ParentDepth extends number = 0,
  HasRootAccess extends boolean = true
> = Modules extends undefined
  ? {}
  : Modules extends object
  ? UnionToIntersection<
      {
        [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
          infer ModuleName,
          infer Mode,
          any,
          any,
          any,
          any,
          infer Children
        >
          ? Mode extends "isolated"
            ? {
                // Create namespace entry for isolated module
                [Namespace in `${ParentNamespace}${ParentNamespace extends ""
                  ? ""
                  : "/"}${K & string}`]: {
                  name: ModuleName;
                  state: ModulesStateMapResolved[ModuleName];
                  getters: ModulesGettersMapResolved[ModuleName];
                  mutations: ModulesMutationsMapResolved[ModuleName];
                  actions: ModulesActionsMapResolved[ModuleName];
                  parentNamespace: ParentNamespace extends ""
                    ? null
                    : ParentNamespace;
                  depth: ParentDepth;
                  fullPath: `${ParentPath}${ParentPath extends ""
                    ? ""
                    : "/"}${K & string}`;
                  hasChildren: Children extends undefined
                    ? false
                    : HasIsolatedChildren<Children>;
                  mode: "isolated";
                };
              } & BuildNamespaceMap<
                Children,
                `${ParentNamespace}${ParentNamespace extends "" ? "" : "/"}${K &
                  string}`,
                `${ParentPath}${ParentPath extends "" ? "" : "/"}${K & string}`,
                Increment<ParentDepth>,
                false
              >
            : // Default mode: skip but continue with children
              BuildNamespaceMap<
                Children,
                ParentNamespace,
                `${ParentPath}${ParentPath extends "" ? "" : "/"}${K & string}`,
                ParentDepth,
                HasRootAccess
              >
          : {};
      }[keyof Required<Modules>]
    >
  : {};

// Helper to check if module has isolated children
type HasIsolatedChildren<Modules> = Modules extends undefined
  ? false
  : Modules extends object
  ? {
      [K in keyof Required<Modules>]: Required<Modules>[K] extends _Module<
        any,
        infer Mode,
        any,
        any,
        any,
        any,
        any
      >
        ? Mode extends "isolated"
          ? true
          : HasIsolatedChildren<
              Required<Modules>[K] extends _Module<
                any,
                any,
                any,
                any,
                any,
                any,
                infer Children
              >
                ? Children
                : undefined
            >
        : false;
    }[keyof Required<Modules>] extends false
    ? false
    : true
  : false;

/**
 * Map of all namespaced (isolated) modules with their namespace paths as keys
 */
type ModulesInfoNamespaceMap = BuildNamespaceMap<
  Required<VuexStoreRootModules>
>;

/**
 * All valid namespace paths that can be used with mappers
 */
type ValidNamespaces = keyof ModulesInfoNamespaceMap;

// Module Namespace Fix End
// ------------------------------------------------------------------

// Mappers Fix Start
// ------------------------------------------------------------------

// helper Types
/**
 * All valid namespaces in the store
 */
export type Namespaces = ValidNamespaces;
type _CustomVue = Record<string, any> & ComponentPublicInstance;
type _Computed<Return> = () => Return;
type _InlineComputed<T extends Function> = T extends (...args: any[]) => infer R
  ? () => R
  : never;

// State
// ##################################################################

// Keys
type RootStateKeys = keyof StoreRootStateResolved;
type RootGettersKeys = keyof StoreRootGettersResolved;
type RootActionsKeys = keyof StoreRootActionsResolved;
type RootMutationsKeys = keyof StoreRootMutationsResolved;

// [1] State Mappers
interface _StateMapper {
  <Key extends RootStateKeys>(map: Key[]): {
    [K in Key]: _Computed<StoreRootStateResolved[K]>;
  };

  <
    Map extends Record<
      string,
      | RootStateKeys
      | ((
          this: _CustomVue,
          state: StoreRootStateResolved,
          getters: StoreRootGettersResolved
        ) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends RootStateKeys
      ? _Computed<StoreRootStateResolved[Map[K]]>
      : _InlineComputed<Map[K]>;
  };
}

interface _StateMapperWithNamespace {
  <
    Namespace extends Namespaces,
    Key extends keyof ModulesInfoNamespaceMap[Namespace]["state"]
  >(
    namespace: Namespace,
    map: Key[]
  ): { [K in Key]: _Computed<ModulesInfoNamespaceMap[Namespace]["state"][K]> };

  <
    Namespace extends Namespaces,
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["state"]
      | ((
          this: _CustomVue,
          state: ModulesInfoNamespaceMap[Namespace]["state"],
          getters: ModulesInfoNamespaceMap[Namespace]["getters"]
        ) => any)
    >
  >(
    namespace: Namespace,
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["state"]
      ? _Computed<ModulesInfoNamespaceMap[Namespace]["state"][Map[K]]>
      : _InlineComputed<Map[K]>;
  };
}

// [2] Getters Mappers
interface _GettersMapper {
  <Key extends RootGettersKeys>(map: Key[]): {
    [K in Key]: _Computed<StoreRootGettersResolved[K]>;
  };

  <Map extends Record<string, RootGettersKeys>>(map: Map): {
    [K in keyof Map]: _Computed<StoreRootGettersResolved[Map[K]]>;
  };
}

interface _GettersMapperWithNamespace {
  <
    Namespace extends Namespaces,
    Key extends keyof ModulesInfoNamespaceMap[Namespace]["getters"]
  >(
    namespace: Namespace,
    map: Key[]
  ): {
    [K in Key]: _Computed<ModulesInfoNamespaceMap[Namespace]["getters"][K]>;
  };

  <
    Namespace extends Namespaces,
    Map extends Record<
      string,
      keyof ModulesInfoNamespaceMap[Namespace]["getters"]
    >
  >(
    namespace: Namespace,
    map: Map
  ): {
    [K in keyof Map]: _Computed<
      ModulesInfoNamespaceMap[Namespace]["getters"][Map[K]]
    >;
  };
}

// [3] Actions Mappers
interface _ActionsMapper {
  <Key extends RootActionsKeys>(map: Key[]): {
    [K in Key]: (
      payload?: StoreRootActionsResolved[K]["payload"] | null
    ) => Promise<StoreRootActionsResolved[K]["return"]>;
  };

  <
    Map extends Record<
      string,
      | RootActionsKeys
      | ((this: _CustomVue, dispatch: _Dispatch, ...args: any[]) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends RootActionsKeys
      ? (
          payload?: StoreRootActionsResolved[Map[K]]["payload"] | null
        ) => Promise<StoreRootActionsResolved[Map[K]]["return"]>
      : Map[K] extends (
          this: any,
          dispatch: any,
          ...args: infer Args
        ) => infer R
      ? (...args: Args) => R
      : never;
  };
}

interface _ActionsMapperWithNamespace {
  <
    Namespace extends Namespaces,
    Key extends keyof ModulesInfoNamespaceMap[Namespace]["actions"]
  >(
    namespace: Namespace,
    map: Key[]
  ): {
    [K in Key]: (
      ...args: ModulesInfoNamespaceMap[Namespace]["actions"][K]["root"] extends true
        ? [
            payload:
              | ModulesInfoNamespaceMap[Namespace]["actions"][K]["payload"]
              | null,
            options: { root: true }
          ]
        : [
            payload?:
              | ModulesInfoNamespaceMap[Namespace]["actions"][K]["payload"]
              | null,
            options?: { root?: false }
          ]
    ) => Promise<ModulesInfoNamespaceMap[Namespace]["actions"][K]["return"]>;
  };

  <
    Namespace extends Namespaces,
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["actions"]
      | ((
          this: _CustomVue,
          dispatch: _ActionContextDispatch<
            ModulesInfoNamespaceMap[Namespace]["name"]
          >,
          ...args: any[]
        ) => any)
    >
  >(
    namespace: Namespace,
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["actions"]
      ? (
          ...args: ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["root"] extends true
            ? [
                payload:
                  | ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["payload"]
                  | null,
                options: { root: true }
              ]
            : [
                payload?:
                  | ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["payload"]
                  | null,
                options?: { root?: false }
              ]
        ) => Promise<
          ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["return"]
        >
      : Map[K] extends (
          this: any,
          dispatch: any,
          ...args: infer Args
        ) => infer R
      ? (...args: Args) => R
      : never;
  };
}

// [4] Mutations Mappers
interface _MutationsMapper {
  <Key extends RootMutationsKeys>(map: Key[]): {
    [K in Key]: (payload?: StoreRootMutationsResolved[K] | null) => void;
  };

  <
    Map extends Record<
      string,
      | RootMutationsKeys
      | ((this: _CustomVue, commit: _Commit, ...args: any[]) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends RootMutationsKeys
      ? (payload?: StoreRootMutationsResolved[Map[K]] | null) => void
      : Map[K] extends (this: any, commit: any, ...args: infer Args) => infer R
      ? (...args: Args) => R
      : never;
  };
}

interface _MutationsMapperWithNamespace {
  <
    Namespace extends Namespaces,
    Key extends keyof ModulesInfoNamespaceMap[Namespace]["mutations"]
  >(
    namespace: Namespace,
    map: Key[]
  ): {
    [K in Key]: (
      payload?: ModulesInfoNamespaceMap[Namespace]["mutations"][K] | null
    ) => void;
  };

  <
    Namespace extends Namespaces,
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["mutations"]
      | ((
          this: _CustomVue,
          commit: _ActionContextCommit<
            ModulesInfoNamespaceMap[Namespace]["name"]
          >,
          ...args: any[]
        ) => any)
    >
  >(
    namespace: Namespace,
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["mutations"]
      ? (
          payload?:
            | ModulesInfoNamespaceMap[Namespace]["mutations"][Map[K]]
            | null
        ) => void
      : Map[K] extends (this: any, commit: any, ...args: infer Args) => infer R
      ? (...args: Args) => R
      : never;
  };
}

// [5] Namespaced Mappers
interface _NamespacedMappers<Namespace extends Namespaces> {
  mapState: _NamespacedStateMapper<Namespace>;
  mapGetters: _NamespacedGettersMapper<Namespace>;
  mapActions: _NamespacedActionsMapper<Namespace>;
  mapMutations: _NamespacedMutationsMapper<Namespace>;
}

interface _NamespacedStateMapper<Namespace extends Namespaces> {
  <Key extends keyof ModulesInfoNamespaceMap[Namespace]["state"]>(map: Key[]): {
    [K in Key]: _Computed<ModulesInfoNamespaceMap[Namespace]["state"][K]>;
  };

  <
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["state"]
      | ((
          this: _CustomVue,
          state: ModulesInfoNamespaceMap[Namespace]["state"],
          getters: ModulesInfoNamespaceMap[Namespace]["getters"]
        ) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["state"]
      ? _Computed<ModulesInfoNamespaceMap[Namespace]["state"][Map[K]]>
      : _InlineComputed<Map[K]>;
  };
}

interface _NamespacedGettersMapper<Namespace extends Namespaces> {
  <Key extends keyof ModulesInfoNamespaceMap[Namespace]["getters"]>(
    map: Key[]
  ): {
    [K in Key]: _Computed<ModulesInfoNamespaceMap[Namespace]["getters"][K]>;
  };

  <
    Map extends Record<
      string,
      keyof ModulesInfoNamespaceMap[Namespace]["getters"]
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: _Computed<
      ModulesInfoNamespaceMap[Namespace]["getters"][Map[K]]
    >;
  };
}

interface _NamespacedActionsMapper<Namespace extends Namespaces> {
  <Key extends keyof ModulesInfoNamespaceMap[Namespace]["actions"]>(
    map: Key[]
  ): {
    [K in Key]: (
      ...args: ModulesInfoNamespaceMap[Namespace]["actions"][K]["root"] extends true
        ? [
            payload:
              | ModulesInfoNamespaceMap[Namespace]["actions"][K]["payload"]
              | null,
            options: { root: true }
          ]
        : [
            payload?:
              | ModulesInfoNamespaceMap[Namespace]["actions"][K]["payload"]
              | null,
            options?: { root?: false }
          ]
    ) => Promise<ModulesInfoNamespaceMap[Namespace]["actions"][K]["return"]>;
  };

  <
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["actions"]
      | ((
          this: _CustomVue,
          dispatch: _ActionContextDispatch<
            ModulesInfoNamespaceMap[Namespace]["name"]
          >,
          ...args: any[]
        ) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["actions"]
      ? (
          ...args: ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["root"] extends true
            ? [
                payload:
                  | ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["payload"]
                  | null,
                options: { root: true }
              ]
            : [
                payload?:
                  | ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["payload"]
                  | null,
                options?: { root?: false }
              ]
        ) => Promise<
          ModulesInfoNamespaceMap[Namespace]["actions"][Map[K]]["return"]
        >
      : Map[K] extends (
          this: any,
          dispatch: any,
          ...args: infer Args
        ) => infer R
      ? (...args: Args) => R
      : never;
  };
}

interface _NamespacedMutationsMapper<Namespace extends Namespaces> {
  <Key extends keyof ModulesInfoNamespaceMap[Namespace]["mutations"]>(
    map: Key[]
  ): {
    [K in Key]: (
      payload?: ModulesInfoNamespaceMap[Namespace]["mutations"][K] | null
    ) => void;
  };

  <
    Map extends Record<
      string,
      | keyof ModulesInfoNamespaceMap[Namespace]["mutations"]
      | ((
          this: _CustomVue,
          commit: _ActionContextCommit<
            ModulesInfoNamespaceMap[Namespace]["name"]
          >,
          ...args: any[]
        ) => any)
    >
  >(
    map: Map
  ): {
    [K in keyof Map]: Map[K] extends keyof ModulesInfoNamespaceMap[Namespace]["mutations"]
      ? (
          payload?:
            | ModulesInfoNamespaceMap[Namespace]["mutations"][Map[K]]
            | null
        ) => void
      : Map[K] extends (this: any, commit: any, ...args: infer Args) => infer R
      ? (...args: Args) => R
      : never;
  };
}

// ##################################################################

// Mappers Fix End
// ------------------------------------------------------------------

// Logger Fix Start
// ------------------------------------------------------------------

interface _Logger
  extends Partial<Pick<Console, "groupCollapsed" | "group" | "groupEnd">> {
  log(message: string, color: string, payload: any): void;
  log(message: string): void;
}

interface _LoggerOption<S, G> {
  /**
   * Filter which mutations to log
   * @param mutation the mutations payload object
   * @param stateBefore store state before update
   * @param stateAfter store state after update
   */
  filter?: (
    mutation: MutationPayloadUnion,
    stateBefore: S,
    stateAfter: S
  ) => boolean;
  /**
   * Transform state before logging
   * @param state the store state
   */
  transformer?: (state: S) => any;
  /**
   * Transform mutation before logging
   * @param mutation
   */
  mutationTransformer?: (mutation: MutationPayloadUnion) => any;
  /**
   * Filter which actions to log
   * @param action action payload object
   * @param state store state
   */
  actionFilter?: (action: ActionPayloadUnion, state: S) => boolean;
  /**
   * Transform action before logging
   * @param action action payload object
   */
  actionTransformer?: (action: ActionPayloadUnion) => any;
  /**
   * Collapse log groups
   * @default true
   */
  collapsed?: boolean;
  /**
   * Log mutations
   * @default true
   */
  logMutations?: boolean;
  /**
   * Log actions
   * @default true
   */
  logActions?: boolean;
  /**
   * Custom logger (default: console)
   */
  logger?: _Logger;
}

// Logger Fix End
// ------------------------------------------------------------------

// ==================================================================
// ========================== Issue End =============================
// ==================================================================

// Utilities Start
// ------------------------------------------------------------------

// Increment utility (extend as needed)
type Increment<N extends number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][N];

type IsGreaterOrEqual1<N extends number> = N extends 0 | -1 | -2 | -3 | -4 | -5
  ? false
  : true;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// prefix helper type
type PrefixHelper<T, Path extends string> = Path extends ""
  ? T
  : {
      [K in keyof T as `${Path}/${K & string}`]: T[K];
    };

// Utilities End
// ------------------------------------------------------------------

export {};
