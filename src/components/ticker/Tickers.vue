<template>
	<div class="tickerWrap">
		<Ticker v-for="(ticker, index) in $store.state.tickers" :key="index" :type="ticker.type" :text="ticker.text" :class="{ show: removingItems.indexOf(ticker) === -1 }" @close="removeTicker(ticker)" @mousemove="stopTimer(ticker)" @mouseenter="stopTimer(ticker)" @mouseleave="resetTimer(ticker)" />
	</div>
</template>

<script>
import Ticker from './Ticker';
import { triggerService } from '../../libraries/common';
export default {
  components: {
    Ticker,
  },
  props: ['text', 'type'],
  data() {
    return {
      removingItems: [],
      timers: [],
    }
  },
  methods: {
    removeTicker(ticker) {
      this.removingItems.push(ticker);
      setTimeout(() => {
        this.removingItems.remove(ticker);
        this.$store.state.tickers.remove(ticker);
      }, 15);
    },
    stopTimer(ticker) {
      var timer = this.timers.find(f => f.ticker === ticker);
      if (timer) timer.trigger.pause();
    },
    resetTimer(ticker) {
      var timer = this.timers.find(f => f.ticker === ticker);
      if (timer) timer.trigger.resetTimer();
    }
  },
  watch: {
    '$store.state.tickers'(tickers) {
      var notInTimers = tickers.filter(ticker => ['info', 'success'].indexOf(ticker.type) !== -1 && !this.timers.any(f => f.ticker === ticker));
      notInTimers.forEach(f => {
        var trig = new triggerService(3000);
        var timer = { ticker: f, trigger: trig };

        trig.push(() => {
          this.timers.remove(timer);
          this.removeTicker(f)
        });
        this.timers.push(timer);
      });
    }
  }
}
</script>