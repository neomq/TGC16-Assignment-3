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

const createProductForm = (note, size, essentialOils, scent, usages, benefits) => {
    return forms.create({
        'image':fields.string({
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
        'price': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.integer()]
        }),
        'note_id': fields.string({
            label:'Note',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: note
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
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.integer()]
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
            }
        }),
        'description': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
        }),
        'application': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
        }),
        'directions': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
        }),
        'beauty_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
        }),
        'body_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
        }),
        'emotional_benefits': fields.string({
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.textarea()
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
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
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
            }
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

module.exports = { createProductForm, bootstrapField, createLoginForm, createEssentialoilForm, createRegistrationForm };