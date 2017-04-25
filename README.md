# Introduction

Yibas is an fully featured solution used to increase sales and reduce cost.

# Topics

- [Client](#client)
    - [Components](#components)
        - [Dialog System Lookup](#dialog-system-lookup)
        - [Field Update Lookup](#field-update-lookup)
        - [Multi System Lookup](#multi-system-lookup)
        - [SideNav](#sidenav)
- [Error handling](#error-handling)
- [Development](#development)
    - [Testing](#testing)

# Client

This section contains code references and documentation specific to the client.

## Components
### Dialog System Lookup

The Dialog System Lookup component is used to display a lookup from a standard lookup control. This component is used to retrieve a single document from a collection.

*Properties*

| Name | Description |
| ----:| --- |
| Collections | An array containing the collections that are used in the lookup. |
| lookupName | A string containing the name of the lookup corresponding to the name field in the systemLookups collection. |

*Example*

The following example shows the three parts required in order to create a basic customer lookup.

Here's the HTML

```html
<dialog-system-lookup [Collections]="customerCollections" [lookupName]="customerLookupName"></dialog-system-lookup>
```

Here's the Javascript

```javascript
import { Component, OnInit } from '@angular/core';
import { Customers } from '../../../../both/collections/customers.collection';
import template from './create-quote.component.html';
import style from './create-quote.component.scss';

@Component({
  selector: 'sample-task',
  template,
  styles: [ style ]
})

export class SampleComponent implements OnInit {
  customerCollections: any[];
  customerLookupName: string;

  constructor() {}

  ngOnInit() {
    this.customerCollections = [Customers];
    this.customerLookupName = 'customers';
  }
}
```

Here's the document
```javascript
{
    "_id" : "jLuoaqfQru7hoZcVs",
    "name" : "customers",
    "collection" : "customers",
    "label" : "Customer",
    "searchable" : true,
    "single" : {
        "returnedFields" : [
            "customer",
            " - ",
            "name"
        ],
        "findOptions" : {
            "fields" : {
                "customer" : NumberInt(1),
                "zipCode" : NumberInt(1),
                "name" : NumberInt(1),
                "city" : NumberInt(1),
                "state" : NumberInt(1),
                "tenantId" : NumberInt(1)
            },
            "sort" : {
                "customer" : NumberInt(1)
            },
            "limit" : NumberInt(10),
            "skip" : NumberInt(0)
        }
    },
    "dataTable" : {
        "table" : {
            "columnMode" : "force",
            "selectionType" : "single"
        },
        "columns" : [
            {
                "prop" : "customer",
                "name" : "Number",
                "hidden" : false,
                "returned" : true
            },
            {
                "prop" : "name",
                "name" : "Customer Name",
                "hidden" : false,
                "returned" : true,
                "width" : NumberInt(200)
            },
            {
                "prop" : "zipCode",
                "name" : "Zip Code",
                "hidden" : false
            },
            {
                "prop" : "city",
                "name" : "City",
                "hidden" : false
            },
            {
                "prop" : "state",
                "hidden" : false,
                "label" : "State"
            }
        ]
    },
    "returnedFields" : [
        "customer",
        " - ",
        "name"
    ],
    "findOptions" : {
        "fields" : {
            "customer" : NumberInt(1),
            "zipCode" : NumberInt(1),
            "name" : NumberInt(1),
            "city" : NumberInt(1),
            "state" : NumberInt(1),
            "tenantId" : NumberInt(1)
        },
        "sort" : {
            "customer" : NumberInt(1)
        },
        "limit" : NumberInt(10),
        "skip" : NumberInt(0)
    },
    "dataTableOptions" : {
        "columnMode" : "flex",
        "selectionType" : "multiClick"
    },
    "dataTableColumns" : [
        {
            "prop" : "customer",
            "name" : "Number",
            "hidden" : false,
            "returned" : true
        },
        {
            "prop" : "name",
            "name" : "Customer Name",
            "hidden" : false,
            "returned" : true,
            "width" : NumberInt(200)
        },
        {
            "prop" : "zipCode",
            "name" : "Zip Code",
            "hidden" : false
        },
        {
            "prop" : "city",
            "name" : "City",
            "hidden" : false
        },
        {
            "prop" : "state",
            "hidden" : false,
            "label" : "State"
        }
    ],
    "tenantId" : "4sdRt09goRP98e456",
    "updatedUserId" : "",
    "createdUserId" : "",
    "updatedAt" : ISODate("2017-03-06T14:54:14.294+0000"),
    "createdAt" : ISODate("2017-03-06T14:54:14.294+0000")
}
```


### Field Update Lookup

### Multi System Lookup

### SideNav

# Error handling

# Development

## Testing