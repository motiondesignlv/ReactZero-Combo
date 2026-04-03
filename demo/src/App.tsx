import { ThemeProvider } from './context/ThemeContext';
import { Header } from './layout/Header';
import { Section } from './layout/Section';
import { Footer } from './layout/Footer';
import { AIBanner } from './sections/AIBanner';
import { Hero } from './sections/Hero';
import { Playground } from './sections/Playground';
import { Variants } from './sections/Variants';
import { MultiSelect } from './sections/MultiSelect';
import { RichContent } from './sections/RichContent';
import { CreativeShowcase } from './sections/CreativeShowcase';
import { GroupedItems } from './sections/GroupedItems';
import { TabbedDemo } from './sections/TabbedDemo';
import { EdgeCases } from './sections/EdgeCases';
import { MixedFeatures } from './sections/MixedFeatures';
import { ThemeShowcase } from './sections/ThemeShowcase';
import { GetStarted } from './sections/GetStarted';
import { Accessibility } from './sections/Accessibility';

// Import library CSS and themes
import '../../src/styles/combo.css';
import '../../src/styles/tabs.css';
import '../../src/themes/default.css';
import '../../src/themes/dark.css';
import '../../src/themes/high-contrast.css';

export function App() {
  return (
    <ThemeProvider>
      <Header />
      <AIBanner />
      <main>
        <Hero />
        <Section id="playground" title="Playground" subtitle="Toggle props and see the result instantly." alt>
          <Playground />
        </Section>
        <Section id="variants" title="Variants" subtitle="Different trigger styles and chevron icons.">
          <Variants />
        </Section>
        <Section id="multi-select" title="Multi-Select" subtitle="Checkbox items with footer actions." alt>
          <MultiSelect />
        </Section>
        <Section id="rich-content" title="Rich Content" subtitle="Custom items with icons, descriptions, and badges.">
          <RichContent />
        </Section>
        <Section id="creative" title="Creative Showcase" subtitle="Push the boundaries with fully custom visual designs." alt>
          <CreativeShowcase />
        </Section>
        <Section id="grouped" title="Grouped Items" subtitle="Categorized items with custom group headers.">
          <GroupedItems />
        </Section>
        <Section id="tabbed" title="Tabbed Popover" subtitle="Switch between item categories with tabs." alt>
          <TabbedDemo />
        </Section>
        <Section id="edge-cases" title="Edge Cases" subtitle="Headless hook usage, controlled state, and dynamic items.">
          <EdgeCases />
        </Section>
        <Section id="mixed" title="Mixed Features" subtitle="Combining multiple features for real-world scenarios." alt>
          <MixedFeatures />
        </Section>
        <Section id="themes" title="Themes" subtitle="Three built-in themes, fully customizable via CSS custom properties.">
          <ThemeShowcase />
        </Section>
        <Section id="accessibility" title="Accessibility" subtitle="ARIA 1.2 compliant keyboard navigation, screen reader support, and high contrast." alt>
          <Accessibility />
        </Section>
        <Section id="get-started" title="Get Started" subtitle="Install and start building in seconds.">
          <GetStarted />
        </Section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
