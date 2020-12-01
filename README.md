> Component like jQuery-quantity-dropdown

## Guide

#### Install
```
# NPM
$ npm i react-quantity-dropdown

# YARN
$ yarn add react-quantity-dropdown
```

#### Usage
```
import React from "react"
import QuantityDropdown from "react-quantity-dropdowm";

render(
const options = [
    {
        title: 'First Option',
        description: 'Description string 1 long test text',
        key: 'item1',
    },
    {
        title: 'Middle Option',
        description: 'Lorem ipsum test string 123',
        key: 'item2',
    },
    {
        title: 'Last Option',
        description: 'Whaaaaaaaaaaaaaaaat?',
        key: 'item3',
    }
];
        
  <QuantityDropdown options={options}/>,
)
```
