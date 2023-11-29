import { forEach } from 'lodash';

export const ReplaceMappingValues = (mapping, values) => {
    forEach(values, (value, attr) => {
        if (value) {
            mapping = mapping.replace('{{' + attr + ':VALUE}}', value);
        }
    });

    mapping = mapping.replace(/}} : {{/g, '}}{{');
    mapping = mapping.replace(/Apt\. {{/g, '{{');
    mapping = mapping.replace(/}} -/g, '}}');
    mapping = mapping.replace(/- {{/g, '{{');

    // Remove unfilled values
    mapping = mapping.replace(/{{[^}]+}}/gi, '');

    return mapping.trim();
};
