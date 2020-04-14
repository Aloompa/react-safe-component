export function isFunctionalComponent(Component) {
  return (
    typeof Component === 'function' && !(
      Component.prototype
        && Component.prototype.isReactComponent
    )
  );
}

export function isClassComponent(Component) {
  return !!(
    typeof Component === 'function'
        && Component.prototype
        && Component.prototype.isReactComponent
  );
}
