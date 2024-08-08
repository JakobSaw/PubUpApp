import React from 'react';

export const navigationRef = React.createRef();

// You can export navigation functions to use throughout your app, without accessing the `navigation` prop.
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

// This is the function you want, it will return the complete navigation state
export function getRootState() {
  return navigationRef.current?.getRootState();
}
