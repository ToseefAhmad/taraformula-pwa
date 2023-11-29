import React, { Fragment, lazy, useMemo } from 'react';
import { usePageBuilder } from '../../talons/usePagebuilder';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../root.css';
import MobileAside from './mobileAside';

const components = {
  main: lazy(() => import('../MainContent')),
  categories: lazy(() => import('../CategoryTree')),
  search: lazy(() => import('../Search')),
  tags: lazy(() => import('../Tags')),
  'featured-posts': lazy(() => import('../FeaturedPosts')),
  'recent-comments': lazy(() => import('../RecentComments')),
  'recent-posts': lazy(() => import('../RecentPosts'))
};

const MAIN_COMPONENTS = ['list', 'grid', 'post'];

const SectionWrapper = props => {
  const { children, name } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  if (name !== 'main') {
    return <div className={classes[name]}>{children}</div>;
  }

  return <Fragment>{children}</Fragment>;
};

const PageBuilder = props => {
  const talons = usePageBuilder();
  const { sections, layoutStyle, mobileAsideLayout } = talons;
  const classes = mergeClasses(defaultClasses, props.classes);

  const layout = useMemo(
    () =>
      Object.keys(sections).map(key => {
        const items = sections[key];

        if (!items || !items.length) {
          return null;
        }

        let hasMainComponent = false;

        return (
          <SectionWrapper name={key} key={key}>
            {items.map(item => {
              const isMain = MAIN_COMPONENTS.includes(item);
              const componentKey = isMain ? 'main' : item;

              const Component =
                isMain && hasMainComponent ? null : components[componentKey];

              if (isMain) {
                hasMainComponent = true;
              }

              return (
                Component && (
                  <Component
                    key={item}
                    classes={{ gridArea: classes[componentKey] }}
                  />
                )
              );
            })}
          </SectionWrapper>
        );
      }),
    [sections, classes]
  );

  return (
    <article style={layoutStyle} className={classes.root}>
      {layout}

      {mobileAsideLayout && mobileAsideLayout.components.length && (
        <MobileAside
          {...talons}
          classes={{ asideContent: classes.asideContent }}
          position={mobileAsideLayout.position}
        >
          {mobileAsideLayout.components.map(item => {
            const Component = components[item];
            return Component && <Component key={item} accordionEnabled />;
          })}
        </MobileAside>
      )}
    </article>
  );
};

export default PageBuilder;
