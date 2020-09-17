import * as PubSub from 'pubsub-js';

export const On = (eventName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value; // save a reference to the original method
    PubSub.subscribe(eventName, originalMethod.bind(this));
    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
