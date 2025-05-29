// enum BoikChannels {
// 	Main = "UC7A_dLnSAjl7uROCdoNyjzg",
// 	HatFilmsGaming = "UCJYvnogbZIQQvX9exn5aDPw",
// 	HatFilmsLive = "UCPgN4KqzELysZU0v9oTs_KA",
// 	HatChat = "UCUCj1zyUUPefT18RytQxu3g",
// 	Crumbs8 = "UCj9naD1BeTO77JW1qRQKKZQ",
// }

// const apiKey = Bun.env.youtube_api_key;

// type YTResp<T> = {
// 	kind:          string;
// 	etag:          string;
// 	nextPageToken: string;
// 	prevPageToken: string;
// 	pageInfo:      {
// 		totalResults:   number;
// 		resultsPerPage: number;
// 	}
// 	items: T[];
// }

// type Thumbnail = {
// 	url:    string;
// 	width:  number;
// 	height: number;
// }

// type Snippet = {
// 	title:       string;
// 	description: string;
// 	customUrl:   string;
// 	publishedAt: string;
// 	thumbnails:  {
// 		default: Thumbnail;
// 		medium: Thumbnail;
// 		high:    Thumbnail;
// 	}
// }

// type Channel = {
// 	kind:           string;
// 	etag:           string;
// 	id:             string;
// 	snippet:        Snippet;
// 	contentDetails: {
// 		relatedPlaylists: {
// 			likes:   string;
// 			uploads: string;
// 		}
// 	};
// 	statistics: {
// 		viewCount:             string;
// 		subscriberCount:       string;
// 		hiddenSubscriberCount: boolean;
// 		videoCount:            string;
// 	};
// }

// type playlistItem = {
// 	kind:    string;
// 	etag:    string;
// 	id:      string;
// 	snippet: {
// 		publishedAt: string;
// 		channelId:   string;
// 		title:       string;
// 		description: string;
// 		thumbnails:  {
// 			default:  Thumbnail;
// 			medium:   Thumbnail;
// 			high:     Thumbnail;
// 			standard: Thumbnail;
// 			maxRes:   Thumbnail;
// 		};
// 		channelTitle: string;
// 		playlistId:   string;
// 		position:     number;
// 		resourceId:   {
// 			kind:    string;
// 			videoId: string;
// 		};
// 		videoOwnerChannelTitle: string;
// 		videoOwnerChannelId:    string;
// 	}
// }

// type Comment = {
// 	kind:    string;
// 	etag:    string;
// 	id:      string;
// 	snippet:  {
// 		authorDisplayName:     string;
// 		authorProfileImageUrl: string;
// 		authorChannelUrl:      string;
// 		authorChannelId:        {
// 			value: string;
// 		};
// 		channelId:        string;
// 		textDisplay:      string;
// 		textOriginal:     string;
// 		parentId:         string;
// 		canRate:          boolean;
// 		viewerRating:     string;
// 		likeCount:        number;
// 		moderationStatus: string;
// 		publishedAt:      string;
// 		updatedAt:        string;
// 	}
// }

// type CommentThread = {
// 	kind:    string;
// 	etag:    string;
// 	id:      string;
// 	snippet: {
// 		channelId:       string;
// 		videoId:         string;
// 		topLevelComment: Comment;
// 		canReply:        boolean;
// 		totalReplyCount: number;
// 		isPublic:        boolean;
// 	};
// 	replies: {
// 		comments: Comment[];
// 	};
// }

// const base = "https://youtube.googleapis.com/youtube/v3";

// async function GetChannel(channelID string): Promise<Channel> {
// 	const resp = await fetch(base+"/channels", url.Values{
// 		"part": {"snippet,contentDetails,statistics"},
// 		"id":   {channelID},
// 	});

//     // YTResp[Channel]

// 	if resp.Ok {
// 		return resp.Json().Items[0]
// 	}

// 	log.Println("Channel, bad request", resp.Text())
// 	return Channel{}
// }

// func GetChannels() []Channel {
// 	channels := []string{
// 		BoikChannels.Main,
// 		BoikChannels.HatFilmsGaming,
// 		BoikChannels.HatFilmsLive,
// 		BoikChannels.HatChat,
// 		BoikChannels.Crumbs8,
// 	}

// 	chs := []Channel{}

// 	for _, ch := range channels {
// 		chs = append(chs, GetChannel(ch))
// 	}

// 	return chs
// }

// func GetPlaylistItemsPage(playlistId string, pageToken string) ([]PlaylistItem, string) {
// 	resp := get[YTResp[PlaylistItem]]("/playlistItems", url.Values{
// 		"part":       {"snippet"},
// 		"playlistId": {playlistId},
// 		"pageToken":  {pageToken},
// 		"maxResults": {"100"},
// 	})

// 	if resp.Ok {
// 		// log.Println(resp.Text())
// 		// log.Printf("%+v", resp.Json())
// 		body := resp.Json()
// 		return body.Items, body.NextPageToken
// 	}

// 	return []PlaylistItem{}, ""
// }

// func GetPlaylistItems(playlistId string, pageToken string) []PlaylistItem {
// 	results, nextPage := GetPlaylistItemsPage(playlistId, pageToken)

// 	if len(results) == 0 {
// 		return results
// 	}

// 	if nextPage != "" {
// 		log.Println("Page: ", nextPage)

// 		results = append(results, GetPlaylistItems(playlistId, nextPage)...)
// 	}

// 	return results
// }
