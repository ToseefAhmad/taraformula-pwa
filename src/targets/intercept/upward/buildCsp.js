module.exports = (definitions, csp) => {
    let cspString = '';

    Object.keys(csp).forEach(key => {
        cspString += `${key} ${csp[key].join(' ')}; `;
    });

    const newDefinitions = {
        ...definitions
    };

    newDefinitions.veniaSecurityHeaders.inline['content-security-policy'].template.when[
        '1'
    ].use.inline = cspString.slice(0, -1);

    return newDefinitions;
};
