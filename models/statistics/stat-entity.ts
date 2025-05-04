export class StatEntity<Type> {
  name: string;

  value: Type;

  constructor(name: string, value: Type) {
    this.name = name;
    this.value = value;
  }
}
