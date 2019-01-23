import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addons';
import { MyButtonComponent } from '../app/components/my-button/my-button.component';

storiesOf('My Button', module)
  .add('with some emoji', () => ({
    component: MyButtonComponent,
    props: {
      text: '😀 😎 👍 💯',
    },
  }))
  .add('with some emoji and action', () => ({
    component: MyButtonComponent,
    props: {
      text: '😀 😎 👍 💯',
      click: action('clicked'),
    },
  }));