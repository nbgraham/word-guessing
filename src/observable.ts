import { useEffect, useState } from "react";

type OnChange<T> = (newValue: T) => void;
export class Observable<T> {
  value: T;
  subscribers: OnChange<T>[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  update(newValue: T) {
    this.value = newValue;
    this.subscribers.forEach((s) => s(newValue));
  }

  subscribe(onChange: OnChange<T>) {
    onChange(this.value);
    this.subscribers.push(onChange);
    const unsubscribe = () => {
      this.subscribers = this.subscribers.filter((s) => s !== onChange);
    };
    return unsubscribe;
  }
}

export function useObservable<T>(observable: Observable<T>) {
  const [value, setValue] = useState<T>(observable.value);
  useEffect(
    () => observable.subscribe((newValue) => setValue(newValue)),
    [observable]
  );
  return [value, (newValue: T) => observable.update(newValue)] as [
    T,
    (v: T) => void
  ];
}
