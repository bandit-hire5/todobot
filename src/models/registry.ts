import { injectable } from "inversify";
import IRegistry from "~src/interfaces/registry";

@injectable()
export default class Registry<ItemType> implements IRegistry<ItemType> {
  private registry = new Set<ItemType>();

  public register(name: ItemType): void {
    this.registry.add(name);
  }

  public unregister(name: ItemType): void {
    this.registry.delete(name);
  }

  public getList(): ItemType[] {
    return Array.from<ItemType>(this.registry.values());
  }
}
