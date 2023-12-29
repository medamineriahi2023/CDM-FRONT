export abstract class AbstractEntity{
  id? : number;
  creationDate?: Date;
  updateDate? :Date;

  public constructor(entity?: AbstractEntity) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
