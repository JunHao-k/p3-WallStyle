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

module.exports = { createProductForm , bootstrapField }
