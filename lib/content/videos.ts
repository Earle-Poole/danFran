import type { VideoRecord } from './types'

const video = (
  id: string,
  videoId: string,
  title: string,
  category: VideoRecord['category']
): VideoRecord => ({
  id,
  provider: 'youtube',
  videoId,
  title,
  category,
  thumbnailUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`,
  watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  embedUrl: `https://www.youtube.com/embed/${videoId}`,
  availability: 'available',
  verification: 'source-confirmed',
  captionStatus: 'not-reviewed',
  descriptionStatus: 'not-reviewed',
  transcriptStatus: 'not-reviewed',
})

export const videos = [
  video('video-shit-italian-moms-01', 'eac91tZsZMw', 'Shit Italian Moms Say #1', 'comedy'),
  video('video-shit-italian-moms-02', 'LCPV0sl4GdE', 'Shit Italian Moms Say #2', 'comedy'),
  video('video-shit-italian-moms-03', 'tSF7heNcXSk', 'Shit Italian Moms Say #3', 'comedy'),
  video('video-stand-up-comedy-act', 'DX2o3U8045U', 'Stand Up Comedy Act', 'comedy'),
  video('video-italian-momster', '_PCPwmuiYL0', 'Italian MOMster: Danny Scares Mom!', 'comedy'),
  video('video-italian-mom-family-stories', 'm7FnCsSJ5WY', 'Italian Mom: Embarrassing Family Stories', 'comedy'),
  video('video-voice-awards', 'kgqXMpDuAA4', 'Daniel Franzese Hosts the Voice Awards', 'interviews-press'),
  video('video-hey-queen', 'ZqtkSped3K4', 'Daniel Franzese on Hey Queen', 'interviews-press'),
  video('video-15-things', 'Bv9mhZqhb8Q', "15 Things You Didn't Know About Daniel Franzese", 'interviews-press'),
  video('video-pop-trigger', 'RpZ_70zuzqg', 'Daniel Franzese Interview on Pop Trigger', 'interviews-press'),
] as const satisfies readonly VideoRecord[]

export const videoById = (id: string): VideoRecord | undefined =>
  videos.find((videoRecord) => videoRecord.id === id)

export const selectVideosByCategory = (
  category: VideoRecord['category'] | 'all'
): readonly VideoRecord[] =>
  category === 'all' ? videos : videos.filter((videoRecord) => videoRecord.category === category)
