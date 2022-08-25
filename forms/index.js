const forms = require("forms")
const fields = forms.fields
const validators = forms.validators
const widgets = forms.widgets;

/* ------------------------------------  This is boilerplate code to style our forms using BootStrap ------------------------------------------------------ */

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

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

/* ------------------------------------  End of boilerplate code to style our forms using BootStrap ------------------------------------------------------ */


const createProductForm = (themes) => {
    return forms.create({
        'title': fields.string({
            required: true,
            errorAfterField: true
        }),
        'combo': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer() , validators.min(0) , validators.max(3)]
        }),
        'sales': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer() , validators.min(0)]
        }),
        'date': fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer() , validators.min(0)]
        }),
        'themes':fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: themes
        }),
        'image_set': fields.string({
            required: true,
            widget: widgets.hidden()
        })
    })
}

const createVariantForm = () => {
    return forms.create({
        'model_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'model_stock': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer() , validators.min(0)]
        }),
        'model_image': fields.string({
            required: true,
            widget: widgets.hidden()
        }),
        'model_thumbnail': fields.string({
            required: true,
            widget: widgets.hidden()
        }),
        'last_updated': fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        })
    })
}

const createSearchForm = (themes) => {

    return forms.create({
        'title': fields.string({
            'required': false,
            errorAfterField: true,
        }),
        'on_sale': fields.string({
            required: false,
            errorAfterField: true,
            choices: [[0, "--- Item on sale ---"], [1 , "Yes"] , [2 , "No"]],
            widget: widgets.select(),  
        }),
        'min_discount': fields.number({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'max_discount': fields.number({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'stock': fields.number({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'date': fields.date({
            required: false,
            errorAfterField: true,
            widget: widgets.date()
        }),
        
        'combo': fields.string({
            required: false,
            errorAfterField: true,
            choices: [[0, "--- Sets with different combinations ---"] , [1 , '1'] , [2 , '2'] , [3 , '3']],
            widget: widgets.select()
        }),
        
        'themes': fields.string({
            required: false,
            errorAfterField: true,
            choices: themes,
            widget: widgets.multipleSelect()
        })
    })
}

const createAccountForm = (roles) => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'first_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.string({
            required: true,
            errorAfterField: true
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            // ensure that the value for confirm_password matches that of the password field
            validators: [validators.matchField('password')]
        }),
        'role_id': fields.string({
            label: 'Role', // Customise the label in hbs to show "Role" instead of "role_id"
            required: true,
            errorAfterField: true,
            widget: widgets.select(), 
            choices: roles
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

const createOrdersUpdateForm = (orderStatuses) => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'shipping_address_1': fields.string({
            required: true,
            errorAfterField: true
        }),
        'shipping_address_2': fields.string({
            required: false,
            errorAfterField: true
        }),
        'shipping_postal_code': fields.string({
            required: true,
            errorAfterField: true
        }),
        'order_status_id': fields.string({
            label: 'Order Status',
            required: true,
            errorAfterField: true,
            widget: widgets.select(), 
            choices: orderStatuses
        })
    })
}

module.exports = { 
    createProductForm, 
    createVariantForm, 
    createSearchForm, 
    createAccountForm, 
    createLoginForm, 
    bootstrapField,
    createOrdersUpdateForm  
}
