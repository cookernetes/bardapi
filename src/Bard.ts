import axios from "axios";

export class BardAPI {
  sessionId: string;

  private readonly headers = {
    Host: "bard.google.com",
    "X-Same-Domain": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    Origin: "https://bard.google.com",
    Referer: "https://bard.google.com/",
  };

  private conversationalData = {
    conversation_id: "",
    response_id: "",
    choice_id: "",
  };

  private _reqid: number;

  constructor({ sessionId }: { sessionId: string }) {
    this.sessionId = sessionId;
    this._reqid = Math.floor(Math.random() * 9000) + 1000;
  }

  private async get_bard_config() {
    const res = await axios.get("https://bard.google.com/", {
      headers: {
        ...this.headers,
        Cookie: `__Secure-1PSID=${this.sessionId}`,
      },
      timeout: 10000,
    });

    if (res.status !== 200) {
      throw new Error("Could not get Google Bard");
    }

    const data = res.data as string;
    const bl = data.match(/"cfb2h":"(.*?)"/)?.[1]
    const at = data.match(/"SNlM0e":"(.*?)"/)?.[1]

    if (!bl || !at) {
      throw new Error("Could not get Google Bard Configuration");
    }

    return {bl, at};
  }

  async ask({
    message,
    previousChoiceId,
  }: {
    message: string;
    previousChoiceId?: string;
  }): Promise<BardChatResponse> {
    const {bl, at} = await this.get_bard_config();


    const qsParams = new URLSearchParams({
      bl,
      _reqid: this._reqid.toString(),
      rt: "j",
    });

    let { conversation_id, response_id, choice_id } = this.conversationalData;

    if (previousChoiceId) choice_id = previousChoiceId;

    const messageStruct = [
      [message],
      null,
      [conversation_id, response_id, choice_id],
    ];

    const body = {
      "f.req": JSON.stringify([null, JSON.stringify(messageStruct)]),
      at,
    };

    // Make request to bard
    const res = await axios.post(
      "https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate",
      body,
      {
        params: qsParams,
        headers: {
          ...this.headers,
          Cookie: `__Secure-1PSID=${this.sessionId}`,
        },
        timeout: 120000,
      }
    );

    const dataBack = res.data as string;

    // Parse response data
    const splitData = JSON.parse(dataBack.split("\n")[2]) as any;
    const chatData = JSON.parse(splitData[0][0][2]) as any;

    const messageBack = chatData[0][0] as string;
    const conversationIdBack = chatData[1][0];
    const responseIdBack = chatData[1][1];
    const choiceIdBack = chatData[4][0][0];

    this.conversationalData = {
      conversation_id: conversationIdBack,
      response_id: responseIdBack,
      choice_id: choiceIdBack,
    };

    return {
      response: messageBack,
      conversation_id: conversationIdBack,
      response_id: responseIdBack,
      choice_id: choiceIdBack,

      otherChoices: (chatData[4] as any[][]).map((choice) => ({
        choiceId: choice[0],
        message: choice[1],
      })),
    };
  }

  reset() {
    this.conversationalData = {
      conversation_id: "",
      response_id: "",
      choice_id: "",
    };
  }
}

export interface BardChatResponse {
  response: string;
  conversation_id: string;
  response_id: string;
  choice_id: string;

  otherChoices: {
    choiceId: string;
    message: string;
  }[];
}
