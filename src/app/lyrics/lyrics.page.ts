import { Component, OnInit } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
  } from '@angular/animations';

import { ApiService } from '../../services/api.service';
import { PlayerService } from '../../services/player.service';
import { RoutestackService } from '../../services/routestack.service';

import { IGetLyricsBody } from '../../common/Interfaces';

@Component({
    selector: 'app-lyrics',
    templateUrl: './lyrics.page.html',
    styleUrls: ['./lyrics.page.scss'],
    animations: [
        trigger('fade-in', [
            state('void', style({opacity: 0})),
            transition('void => *', [
                animate('900ms 300ms ease-out', style({opacity: 100}))
            ])
        ]),
    ]
})
export class LyricsPage implements OnInit {
    lyrics: string = 'No Lyrics Available';
    songName: string;
    artistName: string;

    constructor(
        private apiService: ApiService,
        private playerService: PlayerService,
        private routestackService: RoutestackService,
    ) {}

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.lyrics = this.fetchLyrics();
    }

    ionViewWillLeave() {
        this.playerService.toggleLyricsClose();
    }

    onClose() {
        return this.routestackService.getPreviousUrl();
    }

    fetchLyrics(): string {
        
        const currentTrackId = this.playerService.getCurrentTrackId();
        this.songName = this.playerService.getCurrentTrackName();
        this.artistName = this.playerService.getCurrentTrackArtist();

        this.apiService.fetchLyrics(currentTrackId).subscribe((data: IGetLyricsBody) => {
            this.lyrics = data.lyrics.lyrics_body;
        });

        return this.lyrics;
    }
}
