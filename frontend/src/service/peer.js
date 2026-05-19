class PeerService {
    constructor() {
        if(!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers : [{
                    urls : [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }]
            })
        }
    }

    // async getAnswer(offer) {
    //     if (this.peer){
    //         await this.peer.setRemoteDescription(offer)
    //         const answer = await this.peer.createAnswer()
    //         await this.peer.setLocalDescription(new RTCSessionDescription(offer))
    //         return answer
    //     }
    // }

    async getAnswer(offer) {
  // 1. SET REMOTE OFFER FIRST
  await this.peer.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  // 2. CREATE ANSWER
  const answer = await this.peer.createAnswer();

  // 3. SET LOCAL DESCRIPTION IMMEDIATELY (NO CHANGES IN BETWEEN)
  await this.peer.setLocalDescription(answer);

  return answer;
}

    async getOffer() {
        if(this.peer) {
            const offer = await this.peer.createOffer()
            await this.peer.setLocalDescription(new RTCSessionDescription(offer))
            return offer
        }
    }

    async setLocalDescription(ans) {
        if(this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
        }
    }
}

export default new PeerService()