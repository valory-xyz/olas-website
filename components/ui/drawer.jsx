import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from 'lib/utils';

const Drawer = ({
  shouldScaleBackground,
  ...props
}) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';
Drawer.propTypes = {
  shouldScaleBackground: PropTypes.bool,
};
Drawer.defaultProps = { shouldScaleBackground: true };

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));

DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
DrawerOverlay.propTypes = { className: PropTypes.string };
DrawerOverlay.defaultProps = { className: '' };

const DrawerContent = forwardRef(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';
DrawerContent.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
DrawerContent.defaultProps = { className: '' };

const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';
DrawerHeader.propTypes = { className: PropTypes.string };
DrawerHeader.defaultProps = { className: '' };

const DrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';
DrawerFooter.propTypes = { className: PropTypes.string };
DrawerFooter.defaultProps = { className: '' };

const DrawerTitle = forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
DrawerTitle.propTypes = { className: PropTypes.string };
DrawerTitle.defaultProps = { className: '' };

const DrawerDescription = forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
DrawerDescription.propTypes = { className: PropTypes.string };
DrawerDescription.defaultProps = { className: '' };

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
