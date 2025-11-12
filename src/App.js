import React from "react";
import cx from "classnames";
import { animated, useSprings, config } from "react-spring";
import { useElementSize } from "@kaliber/use-element-size";
import { lerp, unlerp, clamp } from "@kaliber/math";
import { useWindowEvent } from "./machinery/useWindowEvent";
import { useMergedRefs } from "./machinery/useMergedRefs";
import { useCallbackRef } from "./machinery/useCallbackRef";
import styles from "./App.module.scss";
import gradients from "./gradients.module.scss";

// Hack to make @kaliber libraries work, without @kaliber/buld
// Most @kaliber libraries expect React in the global scope
self.React = React;

const cards = [
  {
    text: "Have a go at these horizontally scrolling cards",
    gradient: gradients.a,
  },
  { text: "Bring your own tech!", gradient: gradients.b },
  { text: "I'm using React Spring", gradient: gradients.c },
  { text: "Combined with some custom hooks", gradient: gradients.d },
];

export default function App() {
  const [springs, springsApi] = useSprings(cards.length, (i) => ({
    ...getSpringValues({ index: i, progress: 0 }),
    config: config.gentle,
  }));
  const { ref: sizeRef, size } = useElementSize();
  const { ref: scrollProgressRef } = useScrollProgress((progress) => {
    springsApi.start((i) => getSpringValues({ index: i, progress }));
  });

  return (
    <div
      className={styles.app}
      style={{
        height: `calc(${cards.length} * max(280px, ${size.width}px)`,
      }}
      ref={scrollProgressRef}
    >
      <div className={styles.window}>
        <Header
          title="Creative frontend challenge #4"
          subtitle="Horizontal cards"
          layoutClassName={styles.header}
        />

        <div ref={sizeRef}>
          <HorizontalStack>
            {cards.map((x, i) => (
              <animated.div
                key={i}
                className={styles.cardWrapper}
                style={springs[i]}
              >
                <Card gradient={x.gradient}>{x.text}</Card>
              </animated.div>
            ))}
          </HorizontalStack>
        </div>
      </div>
    </div>
  );

  function getSpringValues({ progress, index }) {
    return {
      x:
        lerp({
          start: 0,
          end: 100,

          // Covert progress into a progress value relevant for this index
          // E.g.: when there are 4 cards, a progress value of 0.625 will convert
          // into a value of:
          // 1 for index 0
          // 1 for index 1
          // 0.5 for index 2
          // 0 for index 3
          input: unlerp({
            start: index,
            end: index + 1,
            input: progress * cards.length,
            clamp: true,
          }),
        }) + "vw",
    };
  }
}

function Header({ title, subtitle }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function HorizontalStack({ children }) {
  const n = React.Children.count(children);

  return (
    <ul className={styles.componentHorizontalStack}>
      {React.Children.map(children, (child, i) => (
        <li className={styles.item} key={i} style={deriveStyle(i)}>
          {child}
        </li>
      ))}
    </ul>
  );

  function deriveStyle(i) {
    return {
      width: 100 - (n - 1) * 10 + "%",
      marginLeft: (n - 1 - i) * 10 + "%",
      zIndex: n - i,
    };
  }
}

function Card({ gradient, children, layoutClassName }) {
  return (
    <div className={cx(styles.componentCard, gradient, layoutClassName)}>
      {children}
    </div>
  );
}

function useScrollProgress(callback) {
  const callbackRef = useCallbackRef(callback);
  const scrollYRef = React.useRef(0);
  const elementRef = React.useRef(null);
  const { ref: elementSizeRef, size } = useElementSize();
  const ref = useMergedRefs(elementRef, elementSizeRef);

  useWindowEvent("resize", handleScrollProgressChange);
  useWindowEvent("scroll", handleScrollProgressChange);

  function handleScrollProgressChange() {
    scrollYRef.current = window.scrollY;
    callbackRef.current(
      unlerp({
        start: elementRef.current.offsetTop,
        end: elementRef.current.offsetTop + size.height - window.innerHeight,
        input: window.scrollY,
      })
    );
  }

  return { ref };
}

// Are you fluent in Dutch, living near Utrecht (The Netherlands) and looking for a challenge?
// Apply for a position as Creative Front-End Developers @ Kaliber!
// https://werkenbij.kaliber.net/creative-front-end-developers/nl
