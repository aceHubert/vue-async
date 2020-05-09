import { Vue, Component } from 'vue-property-decorator';

const exhale = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Component({
  name: 'plugin-ts-a',
})
export default class PluginA extends Vue {
  checking = false;
  heartbeats: number[] = [];
  sheets: number[] = [423, 446, 675, 510, 590, 610, 760];

  get avg() {
    const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0);
    const length = this.heartbeats.length;

    if (!sum && !length) return 0;

    return Math.ceil(sum / length);
  }

  heartbeat() {
    return Math.ceil(Math.random() * (120 - 80) + 80);
  }

  async takePulse(inhale = true) {
    this.checking = true;

    inhale && (await exhale(1000));

    this.heartbeats = Array.from({ length: 20 }, this.heartbeat);

    this.checking = false;
  }

  created() {
    this.takePulse(false);
  }

  render(h: any) {
    return (
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card class="mx-auto" color="grey lighten-4" light max-width="600">
            <v-card-title>
              <v-icon
                color={this.checking ? 'red lighten-2' : 'indigo'}
                class="mr-12"
                size="64"
                onClick={this.takePulse}
              >
                mdi-heart-pulse
              </v-icon>
              <v-row align="start">
                <div class="caption grey--text text-uppercase">Heart rate</div>
                <div>
                  <span class="display-2 font-weight-black">{this.avg || '-'}</span>
                  {this.avg ? <strong>BPM</strong> : null}
                </div>
              </v-row>

              <v-spacer></v-spacer>

              <v-btn icon class="align-self-start" size="28">
                <v-icon>mdi-arrow-right-thick</v-icon>
              </v-btn>
            </v-card-title>

            <v-sheet color="transparent">
              <v-sparkline
                key={String(this.avg)}
                smooth={16}
                gradient={['#f72047', '#ffd200', '#1feaea']}
                line-width={3}
                value={this.heartbeats}
                auto-draw
                stroke-linecap="round"
              ></v-sparkline>
            </v-sheet>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card class="mx-auto text-center" color="green" dark max-width="600">
            <v-card-text>
              <v-sheet color="rgba(0, 0, 0, .12)">
                <v-sparkline
                  value={this.sheets}
                  color="rgba(255, 255, 255, .7)"
                  height="100"
                  padding="24"
                  stroke-linecap="round"
                  smooth
                  slotScopes={{
                    label: (item: any) => item.value,
                  }}
                ></v-sparkline>
              </v-sheet>
            </v-card-text>

            <v-card-text>
              <div class="display-1 font-weight-thin">Sales Last 24h</div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-center">
              <v-btn block text>
                Go to Report
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    );
  }
}
