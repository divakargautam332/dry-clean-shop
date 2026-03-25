import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    icon,
    image,
    imageAlt,
    imagePosition = 'top',
    imageHeight = 'h-48',
    footer,
    className = '',
    bodyClassName = '',
    titleClassName = '',
    subtitleClassName = '',
    hoverable = false,
    bordered = true,
    padding = 'p-4',
    onClick,
}) => {
    const baseClasses = 'bg-white rounded-lg overflow-hidden';
    const borderClass = bordered ? 'border border-gray-200' : '';
    const hoverClass = hoverable ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

    const ImageComponent = image && (
        <div className={`${imagePosition === 'top' ? 'w-full' : 'w-24 h-24 flex-shrink-0'} ${imagePosition === 'top' ? imageHeight : ''} overflow-hidden`}>
            <img
                src={image}
                alt={imageAlt || title || 'Card image'}
                className="w-full h-full object-cover"
            />
        </div>
    );

    const HeaderComponent = (title || subtitle || icon) && (
        <div className={`flex items-start space-x-3 ${padding}`}>
            {icon && (
                <div className="flex-shrink-0">
                    {typeof icon === 'string' ? (
                        <img src={icon} alt="icon" className="w-8 h-8" />
                    ) : (
                        <span className="text-2xl">{icon}</span>
                    )}
                </div>
            )}
            <div className="flex-1">
                {title && (
                    <h3 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <p className={`text-sm text-gray-500 mt-1 ${subtitleClassName}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    const BodyComponent = children && (
        <div className={`${title || subtitle || icon ? '' : padding} ${bodyClassName}`}>
            {children}
        </div>
    );

    const FooterComponent = footer && (
        <div className={`border-t border-gray-100 ${padding}`}>
            {footer}
        </div>
    );

    return (
        <div
            className={`${baseClasses} ${borderClass} ${hoverClass} ${className}`}
            onClick={onClick}
        >
            {imagePosition === 'top' && ImageComponent}

            <div className="flex flex-col">
                {imagePosition === 'left' && (
                    <div className="flex">
                        {ImageComponent}
                        <div className="flex-1">
                            {HeaderComponent}
                            {BodyComponent}
                        </div>
                    </div>
                )}

                {imagePosition !== 'left' && imagePosition !== 'top' && (
                    <>
                        {HeaderComponent}
                        {BodyComponent}
                    </>
                )}

                {imagePosition === 'right' && (
                    <div className="flex flex-row-reverse">
                        {ImageComponent}
                        <div className="flex-1">
                            {HeaderComponent}
                            {BodyComponent}
                        </div>
                    </div>
                )}

                {imagePosition === 'bottom' && (
                    <>
                        {HeaderComponent}
                        {BodyComponent}
                        {ImageComponent}
                    </>
                )}
            </div>

            {FooterComponent}
        </div>
    );
};

export default Card;