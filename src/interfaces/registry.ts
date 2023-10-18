export default interface Registry<ItemType> {
  register(name: ItemType): void;
  unregister(name: ItemType): void;
  getList(): ItemType[];
}
