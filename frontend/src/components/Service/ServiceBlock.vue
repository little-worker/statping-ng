<template>
    <div class="mb-md-4 mb-4">
        <div class="card index-chart" :class="{'expanded-service': expanded}">
            <div class="card-body">
                <div class="col-12">
                    <h4 class="mt-2">
                        <router-link :to="serviceLink(service)" class="d-inline-block text-truncate font-4" style="max-width: 65vw;" :in_service="service">{{service.name}}</router-link>
                        <span class="badge float-right" :class="{'bg-success': service.online, 'bg-danger': !service.online}">{{service.online ? $t('online') : $t('offline')}}</span>
                    </h4>
                    <ServiceTopStats :service="service"/>
                </div>
            </div>

          <GroupServiceFailures :service="service"/>

            <div v-show="!expanded" v-observe-visibility="{callback: visibleChart, throttle: 200}" class="chart-container">
                <ServiceChart :service="service" :visible="visible" :chart_timeframe="chartTimeframe"/>
            </div>

            <div class="row lower_canvas full-col-12 text-white" :class="{'bg-success': service.online, 'bg-danger': !service.online}">
                <div class="col-md-10 col-6">
                    <div class="dropup" :class="{show: dropDownMenu}">
                        <button style="font-size: 10pt;" @click.prevent="openMenu('timeframe')" type="button" class="col-4 float-left btn btn-sm float-right btn-block text-white dropdown-toggle service_scale pr-2">
                            {{timeframepick.text}}
                        </button>
                        <div class="service-tm-menu" :class="{'d-none': !dropDownMenu}">
                            <a v-for="(timeframe, i) in timeframes" @click.prevent="changeTimeframe(timeframe)" class="dropdown-item" href="#" :class="{'active': timeframepick === timeframe}">{{timeframe.text}}</a>
                        </div>
                    </div>

                    <div class="dropup" :class="{show: intervalMenu}">
                        <button style="font-size: 10pt;" @click.prevent="openMenu('interval')" type="button" class="col-4 float-left btn btn-sm float-right btn-block text-white dropdown-toggle service_scale pr-2">
                            {{intervalpick.text}}
                        </button>
                        <div class="service-tm-menu" :class="{'d-none': !intervalMenu}">
                            <a v-for="(interval, i) in intervals" @click.prevent="changeInterval(interval)" class="dropdown-item" href="#" :class="{'active': intervalpick === interval, 'disabled': disabled_interval(interval)}">
                                {{interval.text}}
                            </a>
                        </div>

                        <span class="d-none float-left d-md-inline">
                            {{smallText(service)}}
                        </span>
                    </div>

                </div>


                <div class="col-md-2 col-6 float-right">
                    <button v-if="!expanded" @click="setService" class="btn btn-sm float-right dyn-dark text-white" :class="{'bg-success': service.online, 'bg-danger': !service.online}">
                        {{$t('view')}}
                    </button>
                </div>
            </div>


          <IncidentsBlock :service="service"/>

        </div>
    </div>
</template>

<script>
const Analytics = () => import(/* webpackChunkName: "service" */ './Analytics');
const ServiceChart  = () => import(/* webpackChunkName: "service" */ "./ServiceChart");
const ServiceTopStats = () => import(/* webpackChunkName: "service" */ "@/components/Service/ServiceTopStats");
const GroupServiceFailures = () => import(/* webpackChunkName: "service" */ '@/components/Index/GroupServiceFailures');
const IncidentsBlock = () => import(/* webpackChunkName: "service" */ '@/components/Index/IncidentsBlock');

export default {
    name: 'ServiceBlock',
    components: { Analytics, ServiceTopStats, ServiceChart, GroupServiceFailures, IncidentsBlock },
    props: {
        service: {
            type: Object,
            required: true
        },
    },
  computed: {
    timeframepick() {
      return this.timeframes.find(s => s.value === this.timeframe_val)
    },
    intervalpick() {
      return this.intervals.find(s => s.value === this.interval_val)
    },
    chartTimeframe() {
      return {start_time: this.timeframe_val, interval: this.interval_val}
    }
  },
    data() {
        return {
          timer_func: null,
            expanded: false,
            visible: false,
            dropDownMenu: false,
            intervalMenu: false,
          interval_val: "60m",
          timeframe_val: this.timeset(259200),
          timeframes: [
            {value: this.timeset(1800), text: "30 minutes", set: 1},
            {value: this.timeset(3600), text: "1 heure", set: 2},
            {value: this.timeset(21600), text: "6 heures", set: 3},
            {value: this.timeset(43200), text: "12 heures", set: 4},
            {value: this.timeset(86400), text: "1 jour", set: 5},
            {value: this.timeset(259200), text: "3 jours", set: 6},
            {value: this.timeset(604800), text: "7 jours", set: 7},
            {value: this.timeset(1209600), text: "14 jours", set: 8},
            {value: this.timeset(2592000), text: "1 mois", set: 9},
            {value: this.timeset(7776000), text: "3 mois", set: 10},
            {value: 0, text: "Tout"},
          ],
          intervals: [
            {value: "1m", text: "1/min", set: 1},
            {value: "5m", text: "5/min", set: 2},
            {value: "15m", text: "15/min", set: 3},
            {value: "30m", text: "30/min", set: 4 },
            {value: "60m", text: "1/h", set: 5 },
            {value: "180m", text: "3/h", set: 6 },
            {value: "360m", text: "6/h", set: 7 },
            {value: "720m", text: "12/h", set: 8 },
            {value: "1440m", text: "1/j", set: 9 },
            {value: "4320m", text: "3/j", set: 10 },
            {value: "10080m", text: "7/j", set: 11 },
          ],
          stats: {
                total_failures: {
                    title: "Total échecs",
                    subtitle: "Dernière semaine",
                    value: 0,
                },
                high_latency: {
                    title: "Latence la plus haute",
                    subtitle: "Dernière semaine",
                    value: 0,
                },
                lowest_latency: {
                    title: "Latence la plus basse",
                    subtitle: "Dernière semaine",
                    value: 0,
                },
                high_ping: {
                    title: "Ping le plus élevé",
                    subtitle: "Dernière semaine",
                    value: 0,
                },
                low_ping: {
                    title: "Ping le plus bas",
                    subtitle: "Dernière semaine",
                    value: 0,
                }
            },
        }
    },
  beforeDestroy() {
    // clearInterval(this.timer_func)
  },
  created() {

  },
    methods: {
      disabled_interval(interval) {
        let min = this.timeframepick.set - interval.set - 1;
        return min >= interval.set;
      },
      timeset (seconds) {
        return this.toUnix(this.nowSubtract(seconds))
      },
      openMenu(tm) {
        if (tm === "interval") {
          this.intervalMenu = !this.intervalMenu
          this.dropDownMenu = false
        } else if (tm === "timeframe") {
          this.dropDownMenu = !this.dropDownMenu
          this.intervalMenu = false
        }
      },
      changeInterval(tm) {
        this.interval_val = tm.value
        this.intervalMenu = false
        this.dropDownMenu = false
      },
      changeTimeframe(tm) {
        this.timeframe_val = tm.value
        this.dropDownMenu = false
        this.intervalMenu = false
      },
      async setService() {
        await this.$store.commit('setService', this.service)
        this.$router.push('/service/'+this.service.id, {props: {service: this.service}})
      },
        visibleChart(isVisible, entry) {
                if (isVisible && !this.visible) {
                    this.visible = true

                  // if (!this.timer_func) {
                  //   this.timer_func = setInterval(async () => {
                  //     this.track_service = await Api.service(this.service.id)
                  //   }, this.track_service.check_interval * 100)
                  // }
                }
        }
    }
}
</script>
