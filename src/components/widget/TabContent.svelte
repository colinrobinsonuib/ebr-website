<script>
	import { tabIndex } from '@components/widget/tabStore.js';
	const { index } = $props()
</script>
{#if index === $tabIndex}
	<slot></slot>
{/if}