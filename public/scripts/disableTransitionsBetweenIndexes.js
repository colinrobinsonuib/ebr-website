(function(){
	let beforePreparationListener = (event) => {
		const isPost = (path) => {
			const pathparts = path.split('/');
			if (pathparts.length < 3 ) return false;
			if ( !Number.isNaN(Number.parseInt(pathparts[2])) ) return false;
			return ['essays', 'articles', 'reviews', 'interviews', 'riposte'].includes(pathparts[1])
		}

		if( !isPost(event.from.pathname) && !isPost(event.to.pathname) ) {
			document.querySelectorAll('img[data-astro-transition-scope]').forEach(el => {
				el.removeAttribute('data-astro-transition-scope');
			});
		}
		document.removeEventListener('astro:before-preparation', beforePreparationListener);
	};
	document.addEventListener('astro:before-preparation', beforePreparationListener);
})();