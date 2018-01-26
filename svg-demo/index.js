let svg = Snap(200,200)
let filter = svg.paper.filter(Snap.filter.blur())
svg.paper.circle(50,50,50).attr({
    filter,
})
document.body.appendChild(svg.node)