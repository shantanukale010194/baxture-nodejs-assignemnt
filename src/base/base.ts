import { InMemoryDatabase } from '../Database'


export class BaseClass {
  constructor(){
  }

 public readonly database = new InMemoryDatabase(); 

// Helper function to check if a string is a valid UUID
 public isValidUUID(uuid: string) {
  return uuid.match(/[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/i);
}

}