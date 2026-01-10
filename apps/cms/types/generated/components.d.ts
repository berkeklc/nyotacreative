import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCityFacts extends Struct.ComponentSchema {
  collectionName: 'components_shared_city_facts';
  info: {
    description: 'Quick facts for city/destination pages';
    displayName: 'City Facts';
  };
  attributes: {
    avgTemperature: Schema.Attribute.String;
    bestTimeToVisit: Schema.Attribute.String;
    currency: Schema.Attribute.String;
    language: Schema.Attribute.String;
    population: Schema.Attribute.String;
    timezone: Schema.Attribute.String;
  };
}

export interface SharedDestinationFacts extends Struct.ComponentSchema {
  collectionName: 'components_shared_destination_facts';
  info: {
    description: 'Quick facts for destination pages';
    displayName: 'Destination Facts';
    icon: 'globe';
  };
  attributes: {
    avgTemperature: Schema.Attribute.String;
    bestTimeToVisit: Schema.Attribute.String;
    currency: Schema.Attribute.String;
    language: Schema.Attribute.String;
    population: Schema.Attribute.String;
    timezone: Schema.Attribute.String;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq';
  info: {
    description: 'FAQ item for SEO-rich content';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedItineraryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_itinerary_item';
  info: {
    description: 'Tour itinerary stop';
    displayName: 'Itinerary Item';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.Text;
    location: Schema.Attribute.String;
    time: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours';
  info: {
    description: 'Business hours for attractions';
    displayName: 'Opening Hours';
  };
  attributes: {
    friday: Schema.Attribute.String;
    monday: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    saturday: Schema.Attribute.String;
    sunday: Schema.Attribute.String;
    thursday: Schema.Attribute.String;
    tuesday: Schema.Attribute.String;
    wednesday: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    description: 'SEO metadata for all content types';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media links';
    displayName: 'Social Links';
    icon: 'twitter';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    website: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial';
  info: {
    description: 'Client testimonial for case studies';
    displayName: 'Testimonial';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    avatar: Schema.Attribute.Media<'images'>;
    company: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.city-facts': SharedCityFacts;
      'shared.destination-facts': SharedDestinationFacts;
      'shared.faq': SharedFaq;
      'shared.itinerary-item': SharedItineraryItem;
      'shared.opening-hours': SharedOpeningHours;
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
      'shared.testimonial': SharedTestimonial;
    }
  }
}
