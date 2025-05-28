import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
class IsObjectIdConstraint implements ValidatorConstraintInterface {
    validate(id: any) {
        return /^[0-9a-fA-F]{24}$/.test(id); // Check if the string is a valid hex string of length 24
    }

    defaultMessage() {
        return 'Invalid ObjectID format';
    }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsObjectIdConstraint,
        });
    };
}
