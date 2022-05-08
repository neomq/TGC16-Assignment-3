const forms = require('forms')
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// Bootstrap col-3
var bootstrapFieldcol3 = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group col col-3">' + label + widget + error + '</div>';
};

const createProductForm = (itemtype, size, essentialOils, scent, usages, benefits) => {
    return forms.create({
        'image':fields.string({
            required: true,
            widget: widgets.hidden()
        }),
        'essentialOil_id': fields.string({
            label:'Essential Oil Name',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: essentialOils
        }),
        'size_id': fields.string({
            label:'Size',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: size
        }),
        'price': fields.number({
            label:'Price (in cents)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.number(),
            'validators':[validators.min(1)]
        }),
        'item_type_id': fields.string({
            label:'Item Type',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: itemtype
        }),
        'scent': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: scent
        }),
        'usage': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: usages
        }),
        'benefit': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: benefits
        }),
        'stock': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.number(),
            'validators':[validators.min(1)]
        })
    })
};

const createEssentialoilForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'description': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        }),
        'application': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        }),
        'directions': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        }),
        'beauty_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        }),
        'body_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        }),
        'emotional_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(500)]
        })
    })
};

const createRegistrationForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(320)]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(80)]
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.email()]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        })
    })
}

const createSearchProductForm = (essentialOils, size, itemtype, scent, usages, benefits) => {
    return forms.create({
        'essentialOil_id': fields.string({
            label: 'Essential Oil Name',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: essentialOils
        }),
        'size_id': fields.string({
            label: 'Size',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: size
        }),
        'min_price': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer(), validators.min(0)]
        }),
        'max_price': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer(), validators.min(0)]
        }),
        'item_type_id': fields.string({
            label: 'Item Type',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: itemtype
        }),
        'scent': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: scent
        }),
        'usages': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: usages
        }),
        'benefits': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: benefits
        })
    })
}

const createSearchOrderForm = (orderstatus) => {
    return forms.create({
        'name': fields.string({
            label: 'Customer Name',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            label: 'Customer Email',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'shipping_address': fields.string({
            label: 'Shipping Address',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'order_status_id': fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: orderstatus
        })
    })
}

const createOrderUpdateStatusForm = (orderstatus) => {
    return forms.create({
        'order_status_id': fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: orderstatus
        })
    })
}

const createOrderUpdateAddressForm = () => {
    return forms.create({
        'shipping_address': fields.string({
            label: 'Shipping Address',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea(),
            validators: [validators.maxlength(200)]
        })
    })
}

module.exports = {
    createProductForm, // Create new product
    bootstrapField,
    bootstrapFieldcol3, // Custom form field for product filter
    createLoginForm, // User Login 
    createEssentialoilForm, // Create new essential oil
    createRegistrationForm, // User Registration
    createSearchProductForm, // Search products
    createSearchOrderForm, // Search orders
    createOrderUpdateStatusForm, // update order status
    createOrderUpdateAddressForm // update order address
};