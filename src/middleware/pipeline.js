export default (req, _, next) => {
	const basePipeline = [
		{ $match: { status: { $ne: 'deleted' } } },
		{ $project: {
			__v: false
		}}
	]

	req.pipeline = basePipeline

	req.setPipeline = (pipeline) => {
		req.pipeline = [ ...req.pipeline, ...pipeline ]
	}

	next()
}
