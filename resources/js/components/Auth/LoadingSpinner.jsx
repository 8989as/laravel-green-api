import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({
    size = 'sm',
    variant = 'primary',
    text = null,
    className = '',
    inline = false
}) => {
    const Component = inline ? 'span' : 'div';

    return (
        <Component className={`${inline ? 'd-inline-flex' : 'd-flex'} align-items-center ${className}`}>
            <Spinner
                animation="border"
                size={size}
                variant={variant}
                role="status"
                aria-hidden="true"
                className={text ? 'me-2' : ''}
            />
            {text && <span>{text}</span>}
        </Component>
    );
};

export default LoadingSpinner;