/**
 * @param metadataTracks {TextTrack[]}
 * @return {number} the number of cues in the text tracks
 */
export function cueCountFromTracks(metadataTracks: TextTrack[]) {
  let cueCount = 0
  for (let i = 0; i < metadataTracks.length; i++) {
    const track = metadataTracks[i]
    cueCount = (track?.cues?.length ?? 0) + cueCount
  }

  return cueCount
}
