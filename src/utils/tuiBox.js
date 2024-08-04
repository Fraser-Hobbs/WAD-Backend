const tuiBox = (header = '', content, footer = '', borderStyle = 'single') => {
    // ANSI escape codes for bold, underline, grey text, and reset
    const boldUnderline = '\x1b[1m\x1b[4m';
    const grey = '\x1b[90m'; // Use \x1b[37m for light grey
    const reset = '\x1b[0m';

    // Define border styles
    const borderStyles = {
        single: {
            topLeft: '┌', topRight: '┐',
            bottomLeft: '└', bottomRight: '┘',
            horizontal: '─', vertical: '│'
        },
        double: {
            topLeft: '╔', topRight: '╗',
            bottomLeft: '╚', bottomRight: '╝',
            horizontal: '═', vertical: '║'
        },
        dashed: {
            topLeft: '╓', topRight: '╖',
            bottomLeft: '╙', bottomRight: '╜',
            horizontal: '─', vertical: '│'
        },
        rounded: {
            topLeft: '╭', topRight: '╮',
            bottomLeft: '╰', bottomRight: '╯',
            horizontal: '─', vertical: '│'
        }
    };

    // Choose the border style
    const style = borderStyles[borderStyle] || borderStyles.single;

    // Ensure content is an array of strings
    const contentLines = Array.isArray(content) ? content : content.split('\n').map(line => line.trim());

    // Apply styles to header and footer if provided
    const styledHeader = header ? `${boldUnderline}${header}${reset}` : '';
    const styledFooter = footer ? `${grey}${footer}${reset}` : '';

    // Include header if provided
    if (styledHeader) contentLines.unshift(styledHeader);

    // Calculate the maximum line length (taking styles into account)
    const maxLength = Math.max(...contentLines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length));

    // Construct the box with dynamic width
    const horizontalBorder = style.horizontal.repeat(maxLength + 8);
    const emptyLine = `${style.vertical}${' '.repeat(maxLength + 8)}${style.vertical}`;

    // Map content lines to include proper padding
    const formattedContentLines = contentLines.map((line) => {
        return `${style.vertical}    ${line}${' '.repeat(maxLength - line.replace(/\x1b\[[0-9;]*m/g, '').length)}    ${style.vertical}`;
    }).join('\n');

    // Construct the boxed content
    let boxedContent = `
${style.topLeft}${horizontalBorder}${style.topRight}
${emptyLine}
${formattedContentLines}`;

    // Add empty line and footer if provided, otherwise add an empty line before the bottom border
    if (styledFooter) {
        boxedContent += `
${emptyLine}
${style.vertical}    ${styledFooter}${' '.repeat(maxLength - footer.replace(/\x1b\[[0-9;]*m/g, '').length)}    ${style.vertical}`;
    } else {
        boxedContent += `
${emptyLine}`;
    }

    // Add bottom border
    boxedContent += `
${style.bottomLeft}${horizontalBorder}${style.bottomRight}`;

    console.log(boxedContent);
};

module.exports = tuiBox;
