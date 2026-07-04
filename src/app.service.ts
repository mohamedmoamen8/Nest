import { Injectable } from '@nestjs/common';

export interface Cat {
  name: string;
  age: number;
  gender: string;
}
@Injectable()
export class AppService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
