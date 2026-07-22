export const typeDefs = `#graphql
  type SocialLink {
    platform: String!
    url: String!
    label: String
  }

  input SocialLinkInput {
    platform: String!
    url: String!
    label: String
  }

  type Track {
    id: ID!
    title: String!
    duration: String
    genre: String
    releaseDate: String
    audioUrl: String!
    coverUrl: String
    spotifyUrl: String
    appleUrl: String
  }

  input TrackInput {
    title: String!
    duration: String
    genre: String
    audioUrl: String!
    coverUrl: String
    spotifyUrl: String
    appleUrl: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    tags: [String!]
    mediaUrl: String
  }

  input PostInput {
    title: String!
    content: String!
    tags: [String!]
    mediaUrl: String
  }

  type Artist {
    id: ID!
    name: String!
    handle: String!
    role: String!
    bio: String!
    avatar: String!
    coverImage: String
    isFounder: Boolean
    genres: [String!]
    socialLinks: [SocialLink!]!
    tracks: [Track!]!
    posts: [Post!]!
  }

  input ArtistInput {
    name: String!
    handle: String!
    role: String!
    bio: String!
    avatar: String!
    coverImage: String
    genres: [String!]
    socialLinks: [SocialLinkInput!]
  }

  type SiteSettings {
    siteName: String!
    slogan: String!
    manifesto: String!
    primaryColor: String!
    secondaryColor: String!
    accentGlow: String!
    themeMode: String!
    heroAnnouncement: String
    groupSocials: [SocialLink!]!
  }

  input SiteSettingsInput {
    siteName: String
    slogan: String
    manifesto: String
    primaryColor: String
    secondaryColor: String
    accentGlow: String
    themeMode: String
    heroAnnouncement: String
    groupSocials: [SocialLinkInput!]
  }

  type Query {
    siteSettings: SiteSettings!
    artists: [Artist!]!
    artist(id: ID!): Artist
  }

  type Mutation {
    updateSiteSettings(input: SiteSettingsInput!): SiteSettings!
    createArtist(input: ArtistInput!): Artist!
    updateArtist(id: ID!, input: ArtistInput!): Artist!
    deleteArtist(id: ID!): Boolean!
    createPost(artistId: ID!, input: PostInput!): Post!
    createTrack(artistId: ID!, input: TrackInput!): Track!
  }
`;
