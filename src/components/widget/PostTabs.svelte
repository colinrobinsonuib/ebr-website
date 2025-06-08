<script>
	import { tabIndex } from '@components/widget/tabStore.js';

	export let thread = null;
	export let threadTitle = null;
	export let postType = null;

	function toggle() {
		if ($tabIndex === 0) {
			tabIndex.set(1);
		} else {
			tabIndex.set(0);
		}
	}

</script>
<div class="flex flex-row">
	<div class="relative h-24 w-64">
		<a
			href={'/threads/' + thread}
			class="bg-thread absolute bottom-0 flex w-64 translate-y-20 transform cursor-pointer flex-col rounded-t-4xl py-6 text-center font-mono text-lg transition-transform duration-300 ease-in-out hover:translate-y-4">
			<span class="text-white">{threadTitle}</span>
			<span class="mt-6 text-balance text-black">read more in {threadTitle}</span>
		</a>
	</div>
	{#if $tabIndex === 0}
		<button
			on:click={toggle}
			class="h-24 w-64 translate-y-5 cursor-pointer rounded-t-4xl bg-black py-6 text-center font-mono text-lg text-white transition-transform duration-300 ease-in-out hover:translate-y-3">
			works cited
		</button>
	{:else}
		<button
			on:click={toggle}
			class="h-24 w-64 translate-y-5 cursor-pointer rounded-t-4xl bg-postType py-6 text-center font-mono text-lg text-black transition-transform duration-300 ease-in-out hover:translate-y-3">
			{postType}
		</button>
	{/if}

</div>