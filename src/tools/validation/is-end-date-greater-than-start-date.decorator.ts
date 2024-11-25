import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEndDateGreaterThanStartDate(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEndDateGreaterThanStartDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const relatedValue = (args.object as any)[property];
                    return value > relatedValue; // Check if end date is greater than start date
                },
                defaultMessage(args: ValidationArguments) {
                    return `End date must be greater than start date!`;
                },
            },
        });
    };
}