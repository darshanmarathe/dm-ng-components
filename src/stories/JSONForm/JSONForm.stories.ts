// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta, StoryFn } from '@storybook/angular';
import { JSONForm } from './JSONForm.component';
import { action } from '@storybook/addon-actions';

const actionsData = {
  onChange: action('onChange'),
};
actionsData.onChange = (data) => {
  console.warn(data);
};

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Advanced/JSONForm',
  component: JSONForm,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    change: actionsData.onChange,
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
// const Template: Story<JSONForm> = (args: JSONForm) => ({
//   props: args,
// });

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: StoryFn<JSONForm> = (args) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {}; // Define default arguments here if needed

const defaultSchema = {
  title: 'Person',
  type: 'object',
  required: [
    'name',
    'age',
    'date',
    'favorite_color',
    'gender',
    'location',
    'pets',
  ],
  properties: {
    name: {
      type: 'string',
      description: 'First and Last name',
      minLength: 4,
      default: 'Jeremy Dorn',
    },
    age: {
      type: 'integer',
      default: 25,
      minimum: 18,
      maximum: 99,
    },
    favorite_color: {
      type: 'string',
      format: 'color',
      title: 'favorite color',
      default: '#ffa500',
    },
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other'],
    },
    date: {
      type: 'string',
      format: 'date',
      options: {
        flatpickr: {},
      },
    },
    location: {
      type: 'object',
      title: 'Location',
      required: ['city', 'state', 'citystate'],
      properties: {
        city: {
          type: 'string',
          default: 'San Francisco',
        },
        state: {
          type: 'string',
          default: 'CA',
        },
        citystate: {
          type: 'string',
          description:
            'This is generated automatically from the previous two fields',
          template: '{{city}}, {{state}}',
          watch: {
            city: 'location.city',
            state: 'location.state',
          },
        },
      },
    },
    pets: {
      type: 'array',
      format: 'table',
      title: 'Pets',
      uniqueItems: true,
      items: {
        type: 'object',
        title: 'Pet',
        properties: {
          type: {
            type: 'string',
            enum: ['cat', 'dog', 'bird', 'reptile', 'other'],
            default: 'dog',
          },
          name: {
            type: 'string',
          },
        },
      },
      default: [
        {
          type: 'dog',
          name: 'Walter',
        },
      ],
    },
  },
};
export const Basic = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Basic.args = {
  schema: defaultSchema,
  data: {},
  title: 'Basic component',
};

export const Disabled = Template.bind({});
Disabled.args = {
  schema: defaultSchema,
  data: {},
  enabled: false,
  title: 'Disabled component',
};

export const Event = Template.bind({});
Event.args = {
  schema: defaultSchema,
  data: {},
  enabled: true,
  title: 'Check console.warn for data',
};
