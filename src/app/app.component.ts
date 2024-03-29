import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dm-ng-components';

   defaultSchema = {
    title: "Person",
    type: "object",
    required: [
      "name",
      "age",
      "date",
      "favorite_color",
      "gender",
      "location",
      "pets",
    ],
    properties: {
      name: {
        type: "string",
        description: "First and Last name",
        minLength: 4,
        default: "Jeremy Dorn",
      },
      age: {
        type: "integer",
        default: 25,
        minimum: 18,
        maximum: 99,
      },
      favorite_color: {
        type: "string",
        format: "color",
        title: "favorite color",
        default: "#ffa500",
      },
      gender: {
        type: "string",
        enum: ["male", "female", "other"],
      },
      date: {
        type: "string",
        format: "date",
        options: {
          flatpickr: {},
        },
      },
      location: {
        type: "object",
        title: "Location",
        required: ["city", "state", "citystate"],
        properties: {
          city: {
            type: "string",
            default: "San Francisco",
          },
          state: {
            type: "string",
            default: "CA",
          },
          citystate: {
            type: "string",
            description:
              "This is generated automatically from the previous two fields",
            template: "{{city}}, {{state}}",
            watch: {
              city: "location.city",
              state: "location.state",
            },
          },
        },
      },
      pets: {
        type: "array",
        format: "table",
        title: "Pets",
        uniqueItems: true,
        items: {
          type: "object",
          title: "Pet",
          properties: {
            type: {
              type: "string",
              enum: ["cat", "dog", "bird", "reptile", "other"],
              default: "dog",
            },
            name: {
              type: "string",
            },
          },
        },
        default: [
          {
            type: "dog",
            name: "Walter",
          },
        ],
      },
    },
  };

  item = {}

  ShowItem(_item:any){
    console.warn('Hello.....' ,_item)
    this.item = _item;
    console.log(this.item);

  }
}
