import Vue from "vue";

function injectStore(name, module, store) {
  if (!(name in store._modules.root._children)) {
    store.registerModule(
      name,
      module,
      { preserveState: name in store.state }
    );
  }
}

Vue.prototype.$injectStore = injectStore;

export default function(context, inject) {
  context.$injectStore = injectStore;

  context.store.$injectStore = function(name, module) {
    injectStore(name, module, this);
  }
}
